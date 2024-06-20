const assert = require('assert');
const {
  K8S,
  JAMBONES_NETWORK_CIDR,
  JAMBONES_LOGLEVEL,
  HTTP_PORT
} = require('./lib/config');
assert.ok(K8S || JAMBONES_NETWORK_CIDR, 'missing JAMBONES_NETWORK_CIDR env var');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.text());
const router = require('./lib/router');
const opts = Object.assign({
  timestamp: () => {return `, "time": "${new Date().toISOString()}"`;}
}, {level: JAMBONES_LOGLEVEL || 'info'});
const logger = app.locals.logger = require('pino')(opts);

const port = HTTP_PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`sbc call router app listening on ${JSON.stringify(server.address())} for http requests`);
});

app.use('/', router) ;
