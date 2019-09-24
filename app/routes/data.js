"use strict"

const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('../../config/environments.js').config();
const blockchain = require('../actions/blockchain');

// BigchainDB
const API_PATH = 'http://' + config.BIGCHAINDB.HOST + ':' + config.BIGCHAINDB.PORT + '/api/v1/';
const { BigchainDB, conn } = require('../helpers/connectBigchainDB');
const Orm = require('bigchaindb-orm').default;
const bdbOrm = new Orm(API_PATH);

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

router.post('/v1/data/', function (req, res) {
    let tmp = req.body;
    tmp.timestamp = new Date();
    bdbOrm.define("device", {id: req.body.id});
    // from the defined models in our bdbOrm we create an asset with Alice as owner
    bdbOrm.models["device"]
    .create({
        keypair: {
            publicKey: process.env.PUBLIC_KEY,
            privateKey: process.env.PRIVATE_KEY
        },
        data: tmp
    })
    .then(asset => {
        /*
            asset is an object with all our data and functions
            asset.id equals the id of the asset
            asset.data is data of the last (unspent) transaction
            asset.transactionHistory gives the full raw transaction history
            Note: Raw transaction history has different object structure then
            asset. You can find specific data change in metadata property.
        */
       res.status(200).send(asset);
    });
});

router.get('/v1/data/:key', async function(req, res) {
    
    let metadata = await blockchain.search("device", req.params.key);

    res.status(200).send(metadata);
});

module.exports = router;