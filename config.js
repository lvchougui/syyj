/*
 *	配置文件
 */
var config = module.exports;
var PRODUCTION = process.env.NODE_ENV === "production";
var fs = require('fs');
var path = require('path');
var server = {
	port: process.env.EXPRESS_PORT || 3000,
	ip: "127.0.0.1"
};

config.mysql = {
	port: process.env.MYSQL_PORT || 3306,
	// host: process.env.MYSQL_HOST || "127.0.0.1",
	host: process.env.MYSQL_HOST || "bdm290462466.my3w.com",
	
	user: "bdm290462466",
	// user: "root",
	password: "syyj8866",
	//password: "wxb199109",
	database: "bdm290462466_db",
	insecureAuth: true
};



config.mysql.poolSize = 10;
config.mysql.timeout = 30000;

if(PRODUCTION){
	config.express.ip = "127.0.0.1";
}

config.url_prefix = "public/uploads/";
