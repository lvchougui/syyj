var sqlClient = require('../lib/mysql/mysql');
var certDao = module.exports;
var moment = require('moment');


certDao.getCertList = function(data,cb){
    var sql,sqlCount;
    var sqlCondition = 'select * from tb_certificate where cert_code like \'%'+data.cert_code+'%\' and status = 1 order by id desc limit ?,?';
    var sqlNormal = 'select * from tb_certificate where status = 1 order by id desc limit ?,?';
    var sqlCountNormal ='select count(id) as number from tb_certificate where status = 1';
    var sqlCountCondition ='select count(id) as number from tb_certificate where cert_code like \'%'+data.cert_code+'%\' and status = 1';
    if(data.cert_code){
        sql = sqlCondition;
        sqlCount = sqlCountCondition;
    }else{
        sql = sqlNormal;
        sqlCount = sqlCountNormal;
    }
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

certDao.getDetail = function (certid, cb) {
    var sql = 'select * from tb_certificate where status = 1 and id = '+certid;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        var response={
            product:{},
            cert:data[0]
        }
        if(response.cert.r_prod > 0){
            var sqlProd = 'select * from tb_product where id = '+response.cert.r_prod;
            sqlClient.query(sqlProd,null,function(err, data){
                response.product=data[0];
                return cb&&cb(null,response);
            })
        }else{
            return  cb&&cb(null, response);
        }
    })
}

certDao.frontDetail = function(certCode,cb){
    var sql = 'select tb_certificate.cert_code as cert_code,tb_certificate.cover as cert_cover,tb_product.* from tb_certificate left join tb_product ' +
        'on tb_certificate.r_prod=tb_product.id where tb_certificate.status = 1 and tb_certificate.cert_code = '+certCode;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data[0]);
    })
}

certDao.addCert = function(data,cb){
    var sql = '';
    var fields = [
        'cert_code',
        'cover',
        'r_prod'
    ];
    var values=[
        '?',
        '?',
        '?'
    ];

    var sqlInsert = 'insert into tb_certificate ('+fields.join(',')+') values ('+values.join(',') +')' ;
    // 拼接字符串
    sql += sqlInsert;
    sqlClient.query(sql,[data.cert_code,data.cover,data.r_prod],function(err, rows){
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

certDao.updateCert = function(data,cb){
    var fields = [
        'cert_code = ?',
        'cover = ?',
        'r_prod = ?'
        ]
    //var desc = html_encode(data.detail);
    var sql = 'update tb_certificate set '+fields.join(',')+' where id = '+data.id;
    var prodId = 0;
    if(data.r_prod&&data.r_prod>0){
        prodId = data.r_prod;
    }
    sqlClient.query(sql,[data.cert_code,data.cover,prodId],function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}

certDao.delCert = function(certId,cb){
    var sql='update tb_certificate set status = 0 where status = 1 and id = '+certId;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}
