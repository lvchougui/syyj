var sqlClient = require('../lib/mysql/mysql');
var timeDao = module.exports;
var moment = require('moment');

timeDao.getCateList = function(cb){
    var sql = "select * from tb_cate where status = 1";
    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }

        return cb && cb(null, data);
    })
}

timeDao.addCate = function(data,cb){
    console.log(data);
    var sql = '';
    var fields = [
        'name'
    ];
    var values=[
        '?'
    ];

    var sqlInsert = 'insert into tb_cate ('+fields.join(',')+') values ('+values.join(',') +')' ;
    // 拼接字符串
    sql += sqlInsert;
    sqlClient.query(sql,[data.cateName],function(err, rows){
        if(err){
            return  cb&&cb(err, null);
        }else{
            if(rows.insertId > 0){
                return cb&&cb(null, {cateId:rows.insertId});
            }
            else{
                return cb&&cb(null, {cateId:0});
            }
        }
    })

}

timeDao.delCate = function(cateId,cb){
    var sql='update tb_cate set status = 0 where status = 1 and id = '+cateId;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}