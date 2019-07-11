"use strict"

const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('/usr/src/config/environments.js').config();

router.get('/v1/data', function(req, res) {
    // TODO: Leer MongoDB del usuario
    MongoClient.connect("mongodb://" + config.MONGODB.HOST + ":" + config.MONGODB.PORT + "/",{ useNewUrlParser: true }, function(err, db) {
        if (err) res.status(400).send(err); 
        else {
            db.db("bigchain").collection("assets").count(function(err, assets) {
                if (err) res.status(400).send(err); 
                else {
                    db.db("bigchain").collection("blocks").count(function(err, blocks) {
                        if (err) res.status(400).send(err); 
                        else {
                            db.db("bigchain").collection("metadata").count(function(err, metadata) {
                                if (err) res.status(400).send(err); 
                                else {
                                    db.db("bigchain").collection("transactions").count(function(err, transactions) {
                                        db.close();
                                        res.status(200).send(
                                            {
                                                entities: assets,
                                                blocks: blocks,
                                                metadata: metadata,
                                                transactions: transactions
                                            }
                                        )
                                    });
                                }
                            });
                        }
                    });
                }
            }); 
        }
    });
});

module.exports = router;