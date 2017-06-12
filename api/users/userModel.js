var SqlClient = require('../lib/mysql/mysql');
var utils = require('../lib/utils');
var userModel = module.exports;


/**
 * 根据用户名查找
 * @param code
 * @param cb
 */
userModel.findByUsername = function (username, cb) {
    if(!username){
        return cb("用户名不能为空");
    }
    var sql = "select * from tb_user where username = ?";

    SqlClient.query(sql, username, function(err, data){
        if(err){
            return cb(err, null);
        }
        return cb(null, data);
    });
};
