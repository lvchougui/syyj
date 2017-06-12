var _poolModule = require('generic-pool');
var Config = require('../../../config')

/**
 * 创建数据库连接池
 * @returns {*}
 */
var createMysqlPool = function(){
	return _poolModule.Pool({
		name 	: 'mysql',
		create 	: function (callback) {
			// 创建
			var mysql = require('mysql');
			var client = mysql.createConnection(Config.mysql);

			callback(null, client);
		},
		destroy : function (client) { client.end(); },
		max 	: Config.mysql.poolSize,
		idleTimeoutMillis : Config.mysql.timeout,
		log 	: false
	});
};

exports.createMysqlPool = createMysqlPool;