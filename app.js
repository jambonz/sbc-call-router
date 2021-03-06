const assert = require('assert');
assert.ok(process.env.JAMBONZ_TAGGED_INBOUND || process.env.JAMBONES_OUTBOUND_ROUTE,
  'missing JAMBONES_OUTBOUND_ROUTE env var');
assert.ok(process.env.JAMBONZ_TAGGED_INBOUND ||
  process.env.JAMBONES_INBOUND_ROUTE, 'missing JAMBONES_INBOUND_ROUTE env var');
assert.ok(process.env.JAMBONES_NETWORK_CIDR, 'missing JAMBONES_NETWORK_CIDR env var');

const express = require('express');
const app = express();
const router = require('./lib/router');
const opts = Object.assign({
  timestamp: () => {return `, "time": "${new Date().toISOString()}"`;}
}, {level: process.env.JAMBONES_LOGLEVEL || 'info'});
const logger = app.locals.logger = require('pino')(opts);

const port = process.env.HTTP_PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`sbc call router app listening on ${JSON.stringify(server.address())} for http requests`);
});

app.get('/', router) ;
