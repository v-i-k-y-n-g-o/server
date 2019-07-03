"use strict"

const {BigchainDB, conn} = require('./connectBigchainDB');

module.exports = 
{
    createAsset: function (assetData, assetMetadata, publicKey, privateKey) {
        return new Promise(resolve => {
            // Construct a transaction payload
            let tx = BigchainDB.Transaction.makeCreateTransaction(
                
                // Define the asset to store, in this example it is the current temperature
                // (in Celsius) for the city of Berlin.
                assetData,
    
                // Metadata contains information about the transaction itself
                // (can be `null` if not needed)
                {data: assetMetadata},
            
                // A transaction needs an output
                [ BigchainDB.Transaction.makeOutput(
                    BigchainDB.Transaction.makeEd25519Condition(publicKey))
                ],
                publicKey
            );
    
            // Sign the transaction with private keys
            let txSigned = BigchainDB.Transaction.signTransaction(tx, privateKey);
    
            conn.postTransactionCommit(txSigned)
            .then(retrievedTx => {
                resolve(retrievedTx);
            });
        });
    },

    transferAsset: function (assetID, assetMetadata, inputPrivateKey, outputPublicKey) {
        return new Promise(resolve => {
            conn.searchAssets(assetID)
            .then((asset) => {
            console.log("asset es: ")
            console.log(asset)
            // Get transaction payload by ID
            conn.getTransaction(asset[0].id)
                .then((txCreated) => {
                    console.log("txCreated es: ")
                    console.log(txCreated)
                    const createTranfer = BigchainDB.Transaction.
                    makeTransferTransaction(
                        // The output index 0 is the one that is being spent
                        [{
                            tx: txCreated,
                            output_index: 0
                        }],
                        [BigchainDB.Transaction.makeOutput(
                            BigchainDB.Transaction.makeEd25519Condition(
                                outputPublicKey))],
                                { price: '100 euro' }
                    )
                    // Sign with the key of the owner of the sensor
                    const signedTransfer = BigchainDB.Transaction.signTransaction(createTranfer, inputPrivateKey);
                    conn.postTransactionCommit(signedTransfer)
                        .then(retrievedTx => {
                            console.log(retrievedTx);
                            resolve(retrievedTx);
                        });
                });            
            });
        });
    }
}