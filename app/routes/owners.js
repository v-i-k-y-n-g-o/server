"use strict"

const express = require('express');
const router = express.Router();
const config = require('../../config/environments.js').config();
const MongoClient = require('mongodb').MongoClient;
const driver = require('bigchaindb-driver');
const bip39 = require('bip39');
//const mongoose = require('mongoose'); <=====================
//const Owner = mongoose.model('Owner');

// router.use(function(req, res, next){
//     next();
// })

// router.get('/:username', function(req, res) {
//     MongoClient.connect("mongodb://" + config.MONGODB.HOST + ":" + config.MONGODB.PORT + "/",{ useNewUrlParser: true }, function(err, db) {
//         if (err) {
//            res.status(400).send(err); 
//         }
//         else {
//             db.db(config.MONGODB.DB_NAME).collection("users").find({username: req.params.username}).project({"owners": true}).toArray(function(err2, resp)  {
//                 if (err2) {
//                     db.close();
//                     res.status(400).send(err2); 
//                  }
//                 else {
//                     db.close();
//                     res.status(200).send(resp);
//                 }
//             }); 
//         }
//     });
// });

// router.post('/:username', function(req, res) {
//     MongoClient.connect("mongodb://" + config.MONGODB.HOST + ":" + config.MONGODB.PORT + "/",{ useNewUrlParser: true }, function(err, db) {
//         if (err) {
//             console.log(err)
//             res.status(400).send(err); 
//         }
//         else {
//             let keypair = new driver.Ed25519Keypair(bip39.mnemonicToSeed(req.body.username+req.body.sesgo+new Date()).slice(0, 32));
//             db.db(config.MONGODB.DB_NAME).collection("users").updateOne({username: req.params.username},{ $push: {owners: {name: req.body.name, type: req.body.type, job: req.body.job, publicKey: keypair.publicKey, privateKey: keypair.privateKey}}}, function(err2, resp)  {
//                 if (err2) {
//                     console.log(err2)
//                     db.close();
//                     res.status(400).send(err2); 
//                  }
//                 else {
//                     console.log("got it")
//                     db.close();
//                     res.sendStatus(201);
//                 }
//             }); 
//         }
//     });
// });

// router.delete('/:privatekey', function (req, res) {
//     MongoClient.connect("mongodb://" + config.MONGODB.HOST + ":" + config.MONGODB.PORT + "/",{ useNewUrlParser: true }, function(err, db) {
//         if (err) throw err;
//         let keypair = new driver.Ed25519Keypair(bip39.mnemonicToSeed(req.body.username+req.body.sesgo+new Date()).slice(0, 32));
//         db.db(config.MONGODB.DB_NAME).collection("users").updateOne({},{ $pull: {owners: {privateKey: req.params.privatekey}}}, function(err2, resp)  {
//             if (err2) {
//                 db.close();
//                 res.status(400).send(err2); 
//              }
//             else {
//                 db.close();
//                 res.sendStatus(200);
//             }
//         }); 
//     });
// });

module.exports = router;