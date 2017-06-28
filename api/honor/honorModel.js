var sqlClient = require('../lib/mysql/mysql');
var honorDao = module.exports;
var moment = require('moment');


honorDao.getHonorList = function(data,cb){
    var sql = 'select * from tb_honor where status = 1 order by honor_year desc limit ?,?';
    var sqlCount ='select count(id) as number from tb_honor where status = 1';
    sqlClient.query(sql, [parseInt((data.page - 1) * data.size), parseInt(data.size)], function(err, data){
        if(err){
            return cb && cb(err, null);
        }
        var response={
            array:data,
            counts:0
        }
        if(response.array.length>0){
            sqlClient.query(sqlCount,null,function(err, data){
                response.counts=data[0].number;
                return cb&&cb(null,response);
            })
        }else{
            return cb&&cb(null,response);
        }
    })
}

honorDao.getDetail = function (honorid, cb) {
    var sql = 'select * from tb_honor where status = 1 and id = '+honorid;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        var response={
            product:{},
            honor:data[0]
        }
        if(response.honor.r_prod > 0){
            var sqlProd = 'select * from tb_product where id = '+response.honor.r_prod;
            sqlClient.query(sqlProd,null,function(err, data){
                response.product=data[0];
                return cb&&cb(null,response);
            })
        }else{
            return  cb&&cb(null, response);
        }
    })
}

honorDao.addHonor = function(data,cb){
    var sql = '';
    var fields = [
        'title',
        'cover',
        'r_prod',
        'summary',
        'honor_date',
        'honor_year'
    ];
    var values=[
        '?',
        '?',
        '?',
        '?',
        '?',
        '?'
    ];

    var sqlInsert = 'insert into tb_honor ('+fields.join(',')+') values ('+values.join(',') +')' ;
    // 拼接字符串
    sql += sqlInsert;
    sqlClient.query(sql,[data.title,data.cover,data.r_prod,data.summary,data.honor_date,data.honor_year],function(err, rows){
        if(err){
            return  cb&&cb(err, null);
        }else{
            if(rows.insertId > 0){
                return cb&&cb(null, {certId:rows.insertId});
            }
            else{
                return cb&&cb(null, {certId:0});
            }
        }
    })
}

honorDao.updateHonor = function(data,cb){
    var fields = [
        'title = ?',
        'cover = ?',
        'r_prod = ?',
        'summary = ?',
        'honor_date = ?',
        'honor_year = ?'
        ]
    //var desc = html_encode(data.detail);
    var sql = 'update tb_honor set '+fields.join(',')+' where id = '+data.id;
    var prodId = 0;
    if(data.r_prod&&data.r_prod>0){
        prodId = data.r_prod;
    }
    sqlClient.query(sql,[data.title,data.cover,prodId,data.summary,data.honor_date,data.honor_year],function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}

honorDao.delHonor = function(honorId,cb){
    var sql='update tb_honor set status = 0 where status = 1 and id = '+honorId;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}
