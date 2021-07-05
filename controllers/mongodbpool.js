const config = require('../config')
const mongodb = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
var pool;


module.exports = pool;

module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect(config.dbinfo.host, {useUnifiedTopology: true}, function(err, database) {
      pool = database.db(config.dbinfo.name);
      return callback(err)
    });
  },
  getDb: function() {
    return pool;
  }
};
