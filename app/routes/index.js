'use strict';

//module.exports = morgan
const express = require('express');
const routes = module.exports = express();

// Dependencies
const logger = require('../utils/logger');

// Routes
const auth = require('./auth');
const docs = require('./docs');
const owners = require('./owners');
const assets = require('./assets');

routes.use(express.static(__dirname + '/docs'));
routes.use('/docs', docs);
routes.use('/auth', auth);
routes.use(auth.verifyToken); // TODO: ADD AS A HELPER
routes.use('/api', owners);
routes.use('/api', assets);

// If no route is matched by now, return API version
routes.use(function (req, res) {
    logger.info('Wrong end point: ' + req.originalUrl)
    res.status(404)
    res.json({
      'api_endpoint': '/api/' + config.API_VERSION,
      'request': req.originalUrl
    });
});