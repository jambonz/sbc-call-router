const CIDRMatcher = require('cidr-matcher');
let matcher ;
const debug = require('debug')('jambonz:call-router');
const useTaggedInbound = process.env.JAMBONZ_TAGGED_INBOUND && 1 === parseInt(process.env.JAMBONZ_TAGGED_INBOUND);
const inboundPayload = useTaggedInbound ?
  {tag: 'sbc-inbound'} :
  {uri: process.env.JAMBONES_INBOUND_ROUTE};

const outboundPayload = useTaggedInbound ?
  {tag: 'sbc-outbound'} :
  {uri: process.env.JAMBONES_OUTBOUND_ROUTE};

module.exports = function routeCall(req, res) {
  //const logger = req.app.locals.logger;
  debug(`received incoming call with params ${JSON.stringify(req.query)}`);
  if (!matcher)  matcher = new CIDRMatcher([process.env.JAMBONES_NETWORK_CIDR]);

  /**
   * special case when running in Docker -
   * call coming in on the bridge network from outside
   */
  if (process.env.DOCKER_BRIDGE_IP && req.query.source_address === process.env.DOCKER_BRIDGE_IP) {
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
  debug('INVITE is from external network');
  return res.json({
    action: 'route',
    data: inboundPayload
  });
};
