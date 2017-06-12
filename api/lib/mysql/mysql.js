// mysql CRUD
var sqlClient = module.exports;

var _pool = null;

var Obj = {};

/**
 * 初始化Mysql数据库连接池
 */
Obj.init = function () {
    if (!_pool) {
        _pool = require("./dao-pool").createMysqlPool();
    }
    ;
}

/**
 * Excute sql statement
 * @param {String} sql Statement The sql need to excute.
 * @param {Object} args The args for the sql.
 * @param {fuction} callback Callback function.
 * response
 * { fieldCount: 0,
  affectedRows: 1,
  insertId: 6,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0 }
 */
Obj.query = function (sql, args, callback) {
    console.log("三个参数===》");
    console.log(sql);
    console.log(args);
    console.log(callback);
    _pool.acquire(function (err, client) {
        if (!!err) {
            console.error('[sqlqueryErr] ' + err.stack);
            return;
        }
        client.query(sql, args, function (err, res) {
            // 释放连接
            _pool.release(client);

            callback.apply(null, [err, res]);
        });
    });
};

/**
 * Close connection pool.
 */
Obj.shutdown = function () {
    _pool.destroyAllNow();
};

/**
 * init database
 */
sqlClient.init = function () {
    if (!!_pool) {
        return sqlClient;
    } else {
        Obj.init();
        sqlClient.insert = Obj.query;
        sqlClient.update = Obj.query;
        sqlClient.query = Obj.query;
        // sqlClient.delete = Obj.query;
        sqlClient.getConn = function (cb) {
            _pool.acquire(function (err, client) {
                if (!!err) {
                    console.error('[sqlqueryErr] ' + err.stack);
                    return cb(err, null);
                }
                return cb(null, client);
            });
        }
    }
};

/**
 * shutdown database
 */
sqlClient.shutdown = function () {
    Obj.shutdown();
}
