const environments = {
    "development": {
        "PORT": 3001,
        "HOST": "0.0.0.0",
        "BIGCHAINDB": {
            "HOST": "localhost",
            "PORT": 9984
        },
        "MONGODB": {
            "HOST": "localhost",
            "PORT": 27017,
            "DB_NAME": "vikyngoDB",
        }
    },
    "test": {
        "PORT": 3000,
        "HOST": "0.0.0.0",
        "BIGCHAINDB": {
            "HOST": "localhost",
            "PORT": 9984
        },
        "MONGODB": {
            "HOST": "mongo://mongo",
            "PORT": 27017,
            "DB_NAME": "blockchainService",
        }
    }
}

exports.config = function () {
    var node_env = process.env.NODE_ENV || 'development';
    return {...environments[node_env] };
};
