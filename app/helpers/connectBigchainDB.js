"use strict"

const driver = require('bigchaindb-driver');
const config = require('../../config/environments').config();

// BigchainDB server instance
const API_PATH = 'http://' + config.BIGCHAINDB.HOST + ':' + config.BIGCHAINDB.PORT + '/api/v1/';

// Connection with BigchainDB
const connection = new driver.Connection(API_PATH);

module.exports = {
    driver,
    connection
};