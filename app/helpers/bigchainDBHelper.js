"use strict"

const BigchainDBHelper = require('./connectBigchainDB');

module.exports = 
{
    createAsset: function (assetData, assetMetadata, publicKey, privateKey) {
        console.log("se va a crear un asset")
        // Construct a transaction payload
        let tx = BigchainDBHelper.driver.Transaction.makeCreateTransaction(
            
            // Define the asset to store, in this example it is the current temperature
            // (in Celsius) for the city of Berlin.
            assetData,

            // Metadata contains information about the transaction itself
            // (can be `null` if not needed)
            {data: "this is metadata"},
        
            // A transaction needs an output
            [ BigchainDBHelper.driver.Transaction.makeOutput(
                BigchainDBHelper.driver.Transaction.makeEd25519Condition(publicKey))
            ],
            publicKey
        );

        // Sign the transaction with private keys
        let txSigned = BigchainDBHelper.driver.Transaction.signTransaction(tx, privateKey);

        BigchainDBHelper.connection.postTransactionCommit(txSigned)
        .then(retrievedTx => {
            console.log('Transacción con ID ', retrievedTx.id, 'creada correctamente. Se ha creado un activo');
            return retrievedTx
        });
    },

    transferAsset: function (assetID, assetMetadata, inputPrivateKey, outputPublicKey) {
        BigchainDBHelper.connection.searchAssets(assetID)
        .then((asset) => {
        // Get transaction payload by ID
        BigchainDBHelper.connection.getTransaction(asset[0].id)
            .then((txCreated) => {
                const createTranfer = BigchainDBHelper.driver.Transaction.
                makeTransferTransaction(
                    // The output index 0 is the one that is being spent
                    [{
                        tx: txCreated,
                        output_index: 0 //??????
                    }],
                    [BigchainDBHelper.driver.Transaction.makeOutput(
                        BigchainDBHelper.driver.Transaction.makeEd25519Condition(
                            outputPublicKey))],
                            assetMetadata
                )
                // Sign with the key of the owner of the sensor
                const signedTransfer = BigchainDBHelper.driver.Transaction.signTransaction(createTranfer, inputPrivateKey)
                BigchainDBHelper.connection.postTransactionCommit(signedTransfer)
                    .then(retrievedTx => {
                        console.log(retrievedTx);
                        return retrievedTx
                    });
            });            
        });
    }
}