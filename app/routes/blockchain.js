"use strict"
const config = require('/usr/src/config/environments.js').config();
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
let Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });
const MongoClient = require('mongodb').MongoClient;
const http = require('http');

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

router.get('/v1/blockchain/status', function (req, res) {
    http.get('http://158.176.64.163:32819', (resp) => {
        http.get('http://158.176.64.163:32790/abci_query', (resp2) => {
            if(resp && resp2) res.sendStatus(200);
            else res.sendStatus(404);
            
        }).on("error", (err) => {
            res.status(400).send("Error: " + err.message);
            });
    }).on("error", (err) => {
        res.status(400).send("Error: " + err.message);
    });
});

router.post('/v1/blockchain/config', function (req, res) {
    //TODO: Add schema
    MongoClient.connect("mongodb://" + config.MONGODB.HOST + ":" + config.MONGODB.PORT + "/", { useNewUrlParser: true }, function (err, db) {
        if (err) res.status(400).send(err);
        else {
            if(req.body.customtNode === true) {
                db.db(config.MONGODB.DB_NAME).collection("users").updateOne({ username: res.locals.username },
                    {
                        $set: {
                            custom: {
                                bigchaindb: {
                                    host: req.body.bigchaindb.host,
                                    port: req.body.bigchaindb.port
                                },
                                mongodb: {
                                    host: req.body.mongodb.host,
                                    port: req.body.mongodb.port
                                }
                            },
                            customNode: true
                        }
                    }, function (err, resp) {
                        db.close();
                        if (err) res.status(400).send(err);
                        else res.sendStatus(201);
                    });                
            }
            else {
                db.db(config.MONGODB.DB_NAME).collection("users").updateOne({ username: res.locals.username },
                    {
                        $set: {
                            default: {
                                bigchaindb: {
                                    host: req.body.bigchaindb.host,
                                    port: req.body.bigchaindb.port
                                },
                                mongodb: {
                                    host: req.body.mongodb.host,
                                    port: req.body.mongodb.port
                                }
                            },
                            defaultNode: false
                        }
                    }, function (err, resp) {
                        db.close();
                        if (err) res.status(400).send(err);
                        else res.sendStatus(201);
                    });  
                }
        }
    });
});

module.exports = router;