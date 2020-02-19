const CIDRMatcher = require('cidr-matcher');
const matcher = new CIDRMatcher([process.env.JAMBONES_NETWORK_CIDR]);
const debug = require('debug')('jambonz:call-router');

module.exports = function routeCall(req, res) {
  const logger = req.app.locals.logger;
  debug(`received incoming call with params ${JSON.stringify(req.query)}`);

  if (matcher.contains(req.query.source_address)) {
    debug('INVITE is from internal network');
    return res.json({
      action: 'route',
      data: {
        uri: process.env.JAMBONES_OUTBOUND_ROUTE
      }
    });
  }
  debug('INVITE is from external network');
  return res.json({
    action: 'route',
    data: {
      uri: process.env.JAMBONES_INBOUND_ROUTE
    }
  });
};
