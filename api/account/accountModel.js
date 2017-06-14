/**
 * Created by wei on 16/1/25.
 */
var accountDao = module.exports;
var sqlClient = require('../lib/mysql/mysql');
var moment = require('moment');//moment库是一个时间处理的库
var path=require('path')

accountDao.getConfig = function(cb){
    var sql = 'select * from tb_config';
    sqlClient.query(sql,null,function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }
        else{

            return cb&&cb(null, {result:data});
        }
    })
}

accountDao.updateConfig = function(data,cb){
    var fields = [
        'index_img = ?',
        'img_href = ?',
        'master_desc = ?'
    ];
    var sqlupdate = 'update tb_config set '+fields.join(',')+' ';

    console.log(sqlupdate);
    sqlClient.query(sqlupdate,[data.index_img,data.img_href,data.master_desc],function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(data);
            return cb&&cb(null, {result:200});
        }
    })
}
