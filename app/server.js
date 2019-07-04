'use strict';

// Secret environment variables
require('dotenv').config();

// Configuration
const config = require('/usr/src/config/environments.js').config();
const nopt = require("nopt");
const knownOpts = {
    "verbose": Boolean,
};
const shortHands = {
    "v":["--verbose"]
};
nopt.invalidHandler = function(k,v,t) {
    // TODO: console.log(k,v,t);
}
const parsedArgs = nopt(knownOpts,shortHands,process.argv,2)

// Dependencies// BUENAS PRACTICAS https://expressjs.com/es/advanced/best-practice-security.html
// Dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const errorhandler = require('errorhandler')();

// Helpers
// TODO: Check for enviroments file
const logger = require('./utils/logger');

// TODO:  https://github.com/joze144/pool-shark-api/blob/master/index.js
// pagination
// const pagination = require('./pagination')

// Middleware
app.use(helmet())
app.use(bodyParser.json({limit: '500kb'}));
app.use(bodyParser.urlencoded({limit: '500kb', extended: true}));
app.use(cors());
app.use(errorhandler);
// if (parsedArgs.verbose){
//     const morgan = require('morgan');
//     const morganBody = require('morgan-body');
//     //app.use(morgan('combined'));
//     //app.use(morgan('dev', { 'stream': logger.stream }));
//     morganBody(app);
// }
const morganBody = require('morgan-body');
morganBody(app);
// Routes
const routes = require('./routes');
app.use('', routes);

// HTTPS
const server = (config.HTTPS) ? https.createServer(settings.https, function(req,res) {app(req,res)}) 
                              : http.createServer( function(req,res) {app(req,res)});

// Start the server
server.setMaxListeners(0);
server.listen(config.PORT, config.HOST, () => {
    logger.info('VIKYNGO BLOCKCHAIN SERVICE');
    logger.info('Current environment: ' + (process.env.NODE_ENV || "development"));
    logger.info('Server listening on port ' + config.PORT);
    logger.info('Domain: ' + config.HOST)
});

// Handle Errors
process.on('uncaughtException',function(err) {
    console.log('Uncaught Exception:');
    if (err.stack) {
        console.log(err.stack);
    } else {
        console.log(err);
    }
});