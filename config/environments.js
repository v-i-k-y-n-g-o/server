const environments = {
    "development": {
        "PORT": 3000,
        "VERNEMQ": {
            "HOST": "localhost",
            "PORT": 1883
        },
        "BIGCHAINDB": {
            "HOST": "158.176.64.163",
            "PORT": 32815
        },
        "MONGODB": {
            "HOST": "localhost",
            "PORT": 27018,
            "DB_NAME": "blockchainService",
        },
        "POSTGRESDB": ""
    }

}

exports.config = function () {
    var node_env = process.env.NODE_ENV || 'development';
    return {...environments[node_env] };
};
