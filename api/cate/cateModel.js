var sqlClient = require('../lib/mysql/mysql');
var timeDao = module.exports;
var moment = require('moment');

timeDao.getCateList = function(cb){
    var sql = "select * from tb_cate where status = 1 order by priority desc";
    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }

        return cb && cb(null, data);
    })
}

timeDao.getDetail = function (cateId, cb) {
    var sql = 'select * from tb_cate where status = 1 and id = '+cateId;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data[0]);
    })
}

timeDao.updateCate = function(data,cb){
    var fields = [
        'name = ?',
        'priority = ?'
    ]
    //var desc = html_encode(data.detail);
    var sql = 'update tb_cate set '+fields.join(',')+' where id = '+data.id;
    sqlClient.query(sql,[data.name,data.priority],function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}

timeDao.addCate = function(data,cb){
    console.log(data);
    var sql = '';
    var fields = [
        'name',
        'priority'
    ];
    var values=[
        '?',
        '?'
    ];

    var sqlInsert = 'insert into tb_cate ('+fields.join(',')+') values ('+values.join(',') +')' ;
    // 拼接字符串
    sql += sqlInsert;
    sqlClient.query(sql,[data.name,data.priority],function(err, rows){
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