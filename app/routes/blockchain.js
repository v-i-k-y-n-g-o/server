"use strict"
const config = require('/usr/src/config/environments.js').config();
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
let Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });
const MongoClient = require('mongodb').MongoClient;

router.post('/v1/blockchain/test', function (req, res) {
    docker.listContainers(function (err, containers) {
        if (err) {
            res.send(err)
        }
        else {
            res.send(containers);
        }
    });
});

router.post('/v1/blockchain/start', function (req, res) {
    exec("( cd ./software/bigchaindb/ && sudo make start )", { shell: '/bin/bash' },
        (err, stdout, stderr) => {
            if (err !== null) {
                res.status(500).send(err);
            }
            else {
                res.sendStatus(201);
            }
        });
});

router.post('/v1/blockchain/stop', function (req, res) {
    exec("( cd ./software/bigchaindb/ && sudo make stop )", { shell: '/bin/bash' },
        (err, stdout, stderr) => {
            if (err !== null) {
                res.status(500).send(err);
            }
            else {
                res.sendStatus(201);
            }
        });
});

router.post('/v1/blockchain/reset', function (req, res) {
    exec("( cd ./software/bigchaindb/ && sudo make reset )", { shell: '/bin/bash' },
        (err, stdout, stderr) => {
            if (err !== null) {
                res.status(500).send(err);
            }
            else {
                res.sendStatus(201);
            }
        });
});

router.post('/v1/blockchain/config', function (req, res) {
    //TODO: Add schema
    MongoClient.connect("mongodb://" + config.MONGODB.HOST + ":" + config.MONGODB.PORT + "/", { useNewUrlParser: true }, function (err, db) {
        if (err) res.status(400).send(err);
        else {
            db.db(config.MONGODB.DB_NAME).collection("users").updateOne({ username: res.locals.username },
                {
                    $set: {
                        default: {
                            bigchaindb: {
                                host: "158.176.64.163",
                                port: "32815"
                            },
                            mongodb: {
                                host: "158.176.64.163",
                                port: "32775"
                            }
                        },
                        custom: {
                            bigchaindb: {
                                host: "158.176.64.163",
                                port: "32815"
                            },
                            mongodb: {
                                host: "158.176.64.163",
                                port: "32775"
                            }
                        },
                        defaultNode: true
                    }
                }, function (err, resp) {
                    db.close();
                    if (err) res.status(400).send(err);
                    else res.sendStatus(201);
                });
        }
    });
});

module.exports = router;