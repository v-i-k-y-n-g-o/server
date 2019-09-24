const config = require('../../config/environments.js').config();

// BigchainDB
const API_PATH = 'http://' + config.BIGCHAINDB.HOST + ':' + config.BIGCHAINDB.PORT + '/api/v1/';
const Orm = require('bigchaindb-orm').default;
const bdbOrm = new Orm(API_PATH);

module.exports = {
    search (model, key) {

        return new Promise(resolve => {
            
            bdbOrm.define(model);
            bdbOrm.models[model]
            .retrieve(key)
            .then(assets => {
                let result = [];
                for (let asset in assets) {
                    result.push(assets[asset].data);
                }
                resolve(result);
            });
          });
    }
}

