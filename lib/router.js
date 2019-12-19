const config = require('config') ;
const CIDRMatcher = require('cidr-matcher');
const matcher = new CIDRMatcher(config.get('internal-network-cidrs'));

module.exports = function routeCall(req, res) {
  const logger = req.app.locals.logger;
  logger.info(`received incoming call with params ${JSON.stringify(req.query)}`);

  if (matcher.contains(req.query.source_address)) {
    logger.info('INVITE is from internal network');
    return res.json({
      action: 'route',
      data: {
        uri: config.get('routes.outbound')
      }
    });
  }
  logger.info('INVITE is from external network');
  return res.json({
    action: 'route',
    data: {
      uri: config.get('routes.inbound')
    }
  });
};
