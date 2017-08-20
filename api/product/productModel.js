var sqlClient = require('../lib/mysql/mysql');
var productDao = module.exports;
var moment = require('moment');


productDao.getProductList = function(data,cb){
    var sql,sqlCount;
    var sqlCondition = 'select * from tb_product where name like \'%'+data.name+'%\' or p_code like \'%'+data.name+'%\' or p_style like \'%'+data.name+'%\' and status = 1 and cateId = ? order by id desc limit ?,?';
    var sqlNormal = 'select * from tb_product where status = 1 and cateId = ? order by id desc limit ?,?';
    var sqlCountNormal ='select count(id) as number from tb_product where status = 1 and cateId = '+data.cateId;
    var sqlCountCondition ='select count(id) as number from tb_product where name like \'%'+data.name+'%\' or p_code like \'%'+data.name+'%\' or p_style like \'%'+data.name+'%\' and status = 1 and cateId = '+data.cateId;
    if(data.name){
        sql = sqlCondition;
        sqlCount = sqlCountCondition;
    }else{
        sql = sqlNormal;
        sqlCount = sqlCountNormal;
    }

    sqlClient.query(sql, [data.cateId,parseInt((data.page - 1) * data.size), parseInt(data.size)], function(err, data){
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

productDao.frontGetProductList = function(data,cb){
    var sql,sqlCount;
    var sqlNormal = 'select * from tb_product where status = 1 and p_display = 1';
    var sqlCountNormal ='select count(id) as number from tb_product where status = 1 and p_display = 1';
    var cateCondition = ' and cateId = '+ data.cateId;
    var nameCondition = ' and name like \'%'+data.name+'%\' or p_code like \'%'+data.name+'%\' or p_style like \'%'+data.name+'%\'';
    var orderBy = ' order by id desc limit ?,?';
    if(data.name&&data.name.length>0){
        sql = sqlNormal + nameCondition;
        sqlCount = sqlCountNormal + nameCondition;
    }else{
        sql = sqlNormal;
        sqlCount = sqlCountNormal;
    }
    if(data.cateId&&data.cateId>0){
        sql += cateCondition;
        sqlCount += cateCondition;
    }
    sql += orderBy;
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

productDao.getDetail = function (productid, cb) {
    var sql = 'select * from tb_product where status = 1 and id = '+productid;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
            return  cb&&cb(null, data[0]);
    })
}

productDao.addProduct = function(data,cb){
    var sql = '';
    var fields = [
        'p_code',
        'p_style',
        'name',
        'cover',
        'detail',
        'cateId',
        'p_material',
        'p_size',
        'p_weight',
        'summary',
        'is_sold',
        'p_display'
    ];
    var values=[
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?'
    ];

    var sqlInsert = 'insert into tb_product ('+fields.join(',')+') values ('+values.join(',') +')' ;
    // 拼接字符串
    sql += sqlInsert;
    sqlClient.query(sql,[data.p_code,data.p_style,data.name,data.cover,data.detail,data.cateId,data.p_material,data.p_size,data.p_weight,data.summary,data.is_sold,data.p_display],function(err, rows){
        if(err){
            return  cb&&cb(err, null);
        }else{
            if(rows.insertId > 0){
                return cb&&cb(null, {productId:rows.insertId});
            }
            else{
                return cb&&cb(null, {productId:0});
            }
        }
    })
}

productDao.updateProduct = function(data,cb){
    var fields = [
        'p_code = ?',
        'name = ?',
        'p_style = ?',
        'cover = ?',
        'detail = ?',
        'cateId = ?',
        'p_material = ?',
        'p_size = ?',
        'p_weight = ?',
        'summary = ?',
        'is_sold = ?',
        'p_display = ?'
        ]
    //var desc = html_encode(data.detail);
    var sql = 'update tb_product set '+fields.join(',')+' where id = '+data.id;
    var cateId = 0;
    if(data.cateId && data.cateId>0){
        cateId = data.cateId;
    }
    sqlClient.query(sql,[data.p_code,data.name,data.p_style,data.cover,data.detail,cateId,data.p_material,data.p_size,data.p_weight,data.summary,data.is_sold,data.p_display],function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}

productDao.delProduct = function(productId,cb){
    var sql='update tb_product set status = 0 where status = 1 and id = '+productId;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}

productDao.soldProduct = function(productId,cb){
    var sql='update tb_product set is_sold = 1 where status = 1 and id = '+productId;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}
