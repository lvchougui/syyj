/**
 * Created by wei on 16/1/25.
 */
var sqlClient = require('../lib/mysql/mysql');
var addressDao = module.exports;
var moment = require('moment');//moment库是一个时间处理的库
addressDao.getCities = function(cb){
    var sql = "select * from cities where status = 1 ";

    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }
        return cb && cb(null, data);
    })
}
var getCitiesByProvinceId = function(data,cb){

    var sql = "select * from cities where status = 1 and province_id= "+data;

    sqlClient.query(sql, null, function(err, data){
        if(err){
             cb(err, null);
        }
       cb(null, data);
    })
}
addressDao.getProvinces = function(cb){

    var sql = "select * from provinces where status = 1 ";

    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }
        return cb && cb(null, data);
    })
}

function code(data){
    var indexStr=data.substring(0,4);
    var lastStr=data.substring(data.length-4,data.length);
    var middle='';
    for(var i=0;i<data.length-8;i++){
        middle+='*';
    }
    return indexStr+middle+lastStr;
}
