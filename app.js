const express = require('express');
const app = express();
const config = require('config');
const router = require('./lib/router');
const logger = app.locals.logger = require('pino')({level: 'info'});

const server = app.listen(config.get('server'), () => {
  logger.info(`sbc call router app listening on ${JSON.stringify(server.address())} for http requests`);
});

app.get('/', router) ;
