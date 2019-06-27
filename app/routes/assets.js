"use strict"

const express = require('express');
const router = express.Router();
const config = require('../../config/environments').config();
const API_PATH = 'http://' + config.BIGCHAINDB.HOST + ':' + config.BIGCHAINDB.PORT + '/api/v1/';
// const MongoClient = require('mongodb').MongoClient;
// const driver = require('bigchaindb-driver');
// const bip39 = require('bip39');


const BigchainDB = require('bigchaindb-driver')
const bcdbhelper = require('../helpers/bigchainDBHelper')


// const conn = new BigchainDB.Connection(API_PATH)

// const bip39 = require('bip39')

// const seed = bip39.mnemonicToSeed('seedPhrase').slice(0, 32)
// var alice = new BigchainDB.Ed25519Keypair(seed)



// const Orm = require('bigchaindb-orm').default

// class DID extends Orm {
//     constructor(entity) {
//         super(API_PATH)// Se puede pasar de segundo parámentro las credenciales de la blockhain
//         this.entity = entity
//     }
// }

// router.get('/:modelname', function (req, res) {
//     const assetOrm = new Orm(API_PATH);
//     assetOrm.define(req.params.modelname);
//     assetOrm.models[req.params.modelname]
//         .retrieve()
//         .then(assets => {
//             //console.log(assets)
//             res.status(200).json(assets)
//         })
// });

// router.post('/create', function (req, res) {
//     const assetOrm = new DID(req.body.publicKey)// Clave pública del elemento
//     assetOrm.define(req.body.modelName, req.body.modelInfo) // Tipo de elemento que vamos a registrar, ejemplo Asset y la información fija

//     assetOrm.models[req.body.modelName]
//         .create(
//             {
//                 keypair: req.body.ownerKeyPair,
//                 data: {
//                     myData: req.body.data,
//                     ownerName: req.body.ownerName
//                 }
//             }).then(asset => {
//                 console.log("asset creado")
//                 res.sendStatus(201);

//                 /*
//                     asset is an object with all our data and functions
//                     asset.id equals the id of the asset
//                     asset.data is data of the last (unspent) transaction
//                     asset.transactionHistory gives the full raw transaction history
//                     Note: Raw transaction history has different object structure then
//                     asset. You can find specific data change in metadata property.
//                 */
//             })
//     // // const txCreateAliceSimple = bcdbhelper.createAsset(
//     // //     req.body.modelInfo,
//     // //     req.body.data,
//     // //     req.body.ownerKeyPair.publicKey,
//     // //     req.body.ownerKeyPair.privateKey
//     // // )
// });

// router.post('/test', function (req, res) {

//     const bip39 = require('bip39')
//     const seed = bip39.mnemonicToSeed('seedPhrase').slice(0,32)
//     const alice = new BigchainDB.Ed25519Keypair(seed)

//     const painting = {
//         name: 'Meninas',
//         author: 'Diego Rodgergrríguez de Silva y Velázquez',
//         place: 'Madrid',
//         year: '1656'
//     }


//     // Construct a transaction payload
//     const txCreatePaint = BigchainDB.Transaction.makeCreateTransaction(
//         // Asset field
//         {
//             painting,
//         },
//         // Metadata field, contains information about the transaction itself
//         // (can be `null` if not needed)
//         {
//             datetime: new Date().toString(),
//             location: 'Madrgergeid',
//             value: {
//                 value_eur: '2500gerge0000€',
//                 value_btc: '2200',
//             }
//         },
//         // Output. For this case we create a simple Ed25519 condition
//         [BigchainDB.Transaction.makeOutput(
//             BigchainDB.Transaction.makeEd25519Condition(alice.publicKey))],
//         // Issuers
//         alice.publicKey
//     )
//     // The owner of the painting signs the transaction
//     const txSigned = BigchainDB.Transaction.signTransaction(txCreatePaint,
//         alice.privateKey)

//     // Send the transaction off to BigchainDB
//     conn.postTransactionCommit(txSigned)
//         .then(res => {
//             console.log("asset creado")
//             res.sendStatus(201);
//         })
// });

// router.post('/transfer', function (req, res) {
//     conn.searchAssets(req.body.assetName)
//         .then(assets => {
//             const did = new DID(req.body.assetPublicKey);
//             did.define(req.body.modelName);
//             did.models[req.body.modelName]
//                 .retrieve(assets[0].data.id)
//                 .then(asset => {
//                     let txId = asset[0].transactionHistory[asset[0].transactionHistory.length - 1].id;
//                     // Le pasamos el Id de la última transacción
//                     conn.getTransaction(txId)
//                         .then((txCreated) => {
//                             const createTranfer = BigchainDB.Transaction.
//                                 makeTransferTransaction(
//                                     // The output index 0 is the one that is being spent
//                                     [{
//                                         tx: txCreated,
//                                         output_index: 0
//                                     }],
//                                     [BigchainDB.Transaction.makeOutput(
//                                         BigchainDB.Transaction.makeEd25519Condition(
//                                             req.body.destPublicKey))],
//                                     {
//                                         myData: JSON.parse(req.body.data),
//                                         ownerName: req.body.newOwnerName,
//                                         entityName: req.body.assetName,
//                                         timestamp: Date.now()
//                                     }
//                                 )
//                             // Sign with the key of the owner of the asset
//                             const signedTransfer = BigchainDB.Transaction
//                                 .signTransaction(createTranfer, req.body.ownerPrivateKey)
//                             return conn.postTransactionCommit(signedTransfer)
//                         })
//                         .then(resp => {
//                             console.log("transferencia realizada")
//                             res.send(resp)
//                         });
//                 });
//         });
// });


// // Aunque sea POST esta funcion es para obtener datos 
// // hay que hacerlo en GET como dice aqui https://stackoverflow.com/questions/44280303/angular-http-get-with-parameter/44282037
// router.post('/data/:id/', function (req, res) {
//     let result = [];
//     conn.searchAssets(req.params.id)
//         .then(assets => {
//             const did = new DID(req.body.assetPublicKey);
//             did.define(req.body.modelName);
//             did.models[req.body.modelName]
//                 .retrieve(assets[0].data.id)
//                 .then(asset => {
//                     for(let data = 0; data < asset[0].transactionHistory.length;++data){
//                         result.push(asset[0].transactionHistory[data].metadata.myData[req.body.field])
//                     }
//                     res.send(result)
//                 });
//         });
// });

// router.get('/data/all/', function (req, res) {
//     // Retrieve
//     var MongoClient = require('mongodb').MongoClient;

//     // Connect to the db
//     MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, function(err, client) {
//         if(err) {
//             console.log(err);
//         }
//         var collection = client.db('bigchain').collection('metadata');
//         collection.find().toArray(function(err, metadata) {
//             res.setHeader('Content-Type', 'application/json');
//             res.send(JSON.stringify(metadata));
//         });
//     });

// });

// // ESTA FUNCION ES DEMASIADA COMPLEJA. ES LA FUNCION QUE OBTIENE ALS COLLECIONES Y TRANSFORMA LOS DATOS PARA LA TABLA
// // VAMOS A CAMBIAR EL SISTEMA DE GUARDADO DE DATOS PARA QUE ESTE TODA LA INFO EN EL METADATA
// // router.get('/data/all/', function (req, res) {
// //     // Retrieve
// //     var MongoClient = require('mongodb').MongoClient;

// //     // Connect to the db
// //     MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, function(err, client) {
// //         if(!err) {
// //             console.log("We are connected");
// //         }
// //         var collection = client.db('bigchain').collection('metadata');
// //         collection.find().toArray(function(err, metadata) {
// //             var collection = client.db('bigchain').collection('transactions');
// //             collection.find().toArray(function(err, transactions) {
// //                 var collection = client.db('bigchain').collection('assets');
// //                 collection.find().toArray(function(err, assets) {
// //                     MongoClient.connect("mongodb://localhost:27018",{ useNewUrlParser: true }, function(err, client) {
// //                         if(!err) {
// //                             console.log("We are connected");
// //                         }
// //                         let document = [];
// //                         for()

// //                     });
// //                 });
// //             });
// //         });
// //     });

// // });

// // router.post('/transfer', function(req, res) {
// //     conn.searchAssets(req.body.assetName)
// //     .then(assets => {
// //         const did = new DID(req.body.assetPublicKey);
// //         did.define(req.body.modelName);
// //         did.models[req.body.modelName]
// //         .retrieve(assets[0].data.id)
// //         .then(asset => {
// //             console.log(asset)
// //             // [ OrmObject {
// //             //     _name: 'test',
// //             //     _schema: undefined,
// //             //     _connection:
// //             //      Connection {
// //             //        path: 'http://localhost:9984/api/v1/',
// //             //        headers: {},
// //             //        conn: [Connection] },
// //             //     _appId: 'global',
// //             //     transactionHistory: [ [Object] ],
// //             //     id: 'id:global:test:99040993-0fa3-4c32-9d54-f6d83a65fb1f',
// //             //     data: { myData: '', ownerName: 'Juan Diego' } } ]
// //             return asset.append({
// //                 toPublicKey: req.body.destPublicKey,
// //                 keypair: req.body.ownerKeyPair,
// //                 data: {
// //                     myData: req.body.data,
// //                     ownerName: req.body.ownerName
// //                 }
// //             })
// //         })
// //         .then(updatedAsset => {
// //             console.log("This message does not appear")
// //             console.log(updatedAsset);
// //             res.send(updatedAsset);
// //         })
// //     })
// // });



module.exports = router;