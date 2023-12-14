const CIDRMatcher = require('cidr-matcher');
let matcher, peerVpcmatcher ;
const debug = require('debug')('jambonz:call-router');
const {
  JAMBONZ_TAGGED_INBOUND,
  JAMBONES_INBOUND_ROUTE,
  K8S_SBC_INBOUND_SERVICE_NAME,
  JAMBONES_OUTBOUND_ROUTE,
  K8S_SBC_OUTBOUND_SERVICE_NAME,
  K8S_SBC_REGISTER_SERVICE_NAME,
  K8S_SBC_OPTIONS_SERVICE_NAME,
  JAMBONES_NETWORK_CIDR,
  JAMBONES_PEER_NETWORK_CIDR,
  DOCKER_BRIDGE_IP,
  K8S
} = require('./config');
const useTaggedInbound = JAMBONZ_TAGGED_INBOUND && 1 === parseInt(JAMBONZ_TAGGED_INBOUND);
const inboundPayload = useTaggedInbound ?
  {tag: 'sbc-inbound'} :
  {uri: JAMBONES_INBOUND_ROUTE || K8S_SBC_INBOUND_SERVICE_NAME};

const outboundPayload = useTaggedInbound ?
  {tag: 'sbc-outbound'} :
  {uri: JAMBONES_OUTBOUND_ROUTE || K8S_SBC_OUTBOUND_SERVICE_NAME};

const handleRegister = (logger, req, res) => {
  return res.json({
    action: 'route',
    data: {uri: K8S_SBC_REGISTER_SERVICE_NAME || 'missing-register-service-name'}
  });
};

const handleOptions = (logger, req, res) => {
  return res.json({
    action: 'route',
    data: {uri: K8S_SBC_OPTIONS_SERVICE_NAME || 'missing-options-service-name'}
  });
};

const handleInviteK8S = (logger, req, res) => {
  if (req.body && req.body.includes('X-Jambonz-Routing')) {
    return res.json({
      action: 'route',
      data: outboundPayload
    });
  }
  else {
    return res.json({
      action: 'route',
      data: inboundPayload
    });
  }
};

const handleInvite = (logger, req, res) => {
  if (!matcher)  {
    const cidrs = JAMBONES_NETWORK_CIDR
      .split(',')
      .map((s) => s.trim());
    matcher = new CIDRMatcher(cidrs);
    logger.info({cidrs}, 'Internal network CIDRs');
  }
  if (!peerVpcmatcher && JAMBONES_PEER_NETWORK_CIDR) {
    const peerCidrs = JAMBONES_PEER_NETWORK_CIDR
      .split(',')
      .map((s) => s.trim());
    peerVpcmatcher = new CIDRMatcher(peerCidrs);
    logger.info({peerCidrs}, 'Peering network CIDRs');

  }

  /**
   * special case when running in Docker -
   * call coming in on the bridge network from outside
   */
  if (DOCKER_BRIDGE_IP && req.query.source_address === DOCKER_BRIDGE_IP) {
    debug('INVITE is from external source (arriving on docker bridge IP');
    return res.json({
      action: 'route',
      data: inboundPayload
    });
  }
  if (matcher.contains(req.query.source_address)) {
    debug('INVITE is from internal network');
    return res.json({
      action: 'route',
      data: outboundPayload
    });
  }
  else if (peerVpcmatcher && peerVpcmatcher.contains(req.query.source_address)) {
    debug('INVITE is from internal peering network');
    return res.json({
      action: 'route',
      data: outboundPayload
    });
  }
  debug('INVITE is from external network');
  return res.json({
    action: 'route',
    data: inboundPayload
  });
};

module.exports = function routeCall(req, res) {
  const logger = req.app.locals.logger;
  const method = req.query.method.toLowerCase();

  switch (method) {
    case 'invite':
      if (K8S) handleInviteK8S(logger, req, res);
      else handleInvite(logger, req, res);
      break;
    case 'register':
      handleRegister(logger, req, res);
      break;
    case 'options':
      handleOptions(logger, req, res);
      break;
    default:
      logger.info(`discarding ${method}: we currently do not handle that`);
      res.sendStatus(501);
  }
};
