var Connection = require('tedious').Connection

var tediousConfig = require('./tediousConfig.json');

var poolApi = require('generic-pool');
var poolConfig = require('./poolConfig.json');

var pool = poolApi.Pool({
  name: poolConfig.name,
  max: poolConfig.max,
  min: poolConfig.min,
  idleTimeoutMillis: poolConfig.idleTimeoutMillis,
  create: function(callback) {
    try{
      new Connection(tediousConfig).on('connect',function(err){
        if(err){
          console.log(err)
        }
        else{
          callback(err,this)
        }
      });
    }
    catch(err){
      console.log(err)
    }
  },
  destroy: function(conn) {
    conn.close();
  }

});
exports.pool = pool;