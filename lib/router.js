const CIDRMatcher = require('cidr-matcher');
const matcher = new CIDRMatcher(process.env.JAMBONES_NETWORK_CIDR);

module.exports = function routeCall(req, res) {
  const logger = req.app.locals.logger;
  logger.info(`received incoming call with params ${JSON.stringify(req.query)}`);

  if (matcher.contains(req.query.source_address)) {
    logger.info('INVITE is from internal network');
    return res.json({
      action: 'route',
      data: {
        uri: process.env.JAMBONES_OUTBOUND_ROUTE
      }
    });
  }
  logger.info('INVITE is from external network');
  return res.json({
    action: 'route',
    data: {
      uri: process.env.JAMBONES_OUTBOUND_ROUTE
    }
  });
};
