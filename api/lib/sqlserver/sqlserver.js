// sqlserver DAO Utils
var sqlClient = module.exports;
var Request = require('tedious').Request;

var _pool = null;
var Obj = {};


/**
 * 初始化SqlServer数据库连接池
 */
Obj.init = function(app) {
    if (!_pool) {
        _pool = require('./dao-pool').pool;
    };
}

/**
 * Excute sql statement
 * @param {String} sql Statement The sql need to excute. eg: 'select id from address where first_name = @name and age > @age';
 * @param {Object} args The args for the sql. {param:'name',type:TYPES.VarChar,value:'dongyu'}
 * @param {fuction} callback Callback function.
 *
 */
Obj.query = function(sql, args, callback) {

    _pool.acquire(function(err, client) {
        if (!!err) {
            console.error('[sqlqueryErr] ' + err.stack);
            return;
        }

        sql = sql.toString();
        var results = [];
        request = new Request(sql, function(err, rowCount, rows) {

            if (err) {
                console.log('Statement failed: ' + err);
            } else {
                console.log('[query result] ' + rowCount + ' rows is find.');
                for (var i in rows) {
                    var obj = {};
                    for (var ii in rows[i]) {
                        obj[rows[i][ii].metadata.colName] = rows[i][ii].value;
                    }
                    results.push(obj);
                }
                console.log("[query data] : ");
                console.log(results);

            }
            // 释放连接
            _pool.release(client);
            // client.close();
            callback(err, results);
        });

        args = args || [];
        for (var i in args) {
            request.addParameter(args[i]['param'], args[i]['type'], args[i]['value']);
        }

        // In SQL Server 2000 you may need: connection.execSqlBatch(request);
        client.execSql(request);

    });
};
/**
 * 添加
 * @param sql
 * @param params
 * @param cb
 */
Obj.insert = function (sql, args, cb){
    _pool.acquire(function(err, client){
        if (!!err) {
            console.error('[Sql Pool Error] ' + err.stack);
            return;
        }
        sql = sql.toString();
        var request = new Request(sql, function(err, rowCount, rows) {

            if (err) {
                console.log('Statement failed: ' + err);
            } else {
                console.log('[query result] ' + rowCount + ' rows is find.');
            }
            // 释放连接
            _pool.release(client);
            return cb(err, rowCount);
        });

        args = args || [];
        for (var i in args) {
            request.addParameter(args[i]['param'], args[i]['type'], args[i]['value']);
        }
        console.log("sql = "+sql);
        client.execSql(request);
    });
}
/**
 * Close connection pool.
 */
Obj.shutdown = function() {
    _pool.destroyAllNow();
};

/**
 * init database
 */
sqlClient.init = function() {
    if (!!_pool) {
        return sqlClient;
    } else {
        Obj.init();
        sqlClient.insert = Obj.insert;
        // sqlClient.update = Obj.query;
        sqlClient.query = Obj.query;
        // sqlClient.delete = Obj.query;

        return sqlClient;
    }
};

/**
 * shutdown database
 */
sqlClient.shutdown = function() {
    Obj.shutdown();
}
