var sqlClient = require('../lib/mysql/mysql');
var bannerDao = module.exports;
var moment = require('moment');

bannerDao.getBannerList = function(cb){
    var sql = "select * from tb_banner where status = 1 order by priority desc";
    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }

        return cb && cb(null, data);
    })
}

bannerDao.getDetail = function (bannerId, cb) {
    var sql = 'select * from tb_banner where status = 1 and id = '+bannerId;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data[0]);
    })
}

bannerDao.updateBanner = function(data,cb){
    var fields = [
        'name = ?',
        'cover = ?',
        'cover_link = ?',
        'priority = ?'
    ]
    //var desc = html_encode(data.detail);
    var sql = 'update tb_banner set '+fields.join(',')+' where id = '+data.id;
    sqlClient.query(sql,[data.name,data.cover,data.cover_link,data.priority],function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}

bannerDao.addBanner = function(data,cb){
    console.log(data);
    var sql = '';
    var fields = [
        'name',
        'cover',
        'cover_link',
        'priority'
    ];
    var values=[
        '?',
        '?',
        '?',
        '?'
    ];

    var sqlInsert = 'insert into tb_banner ('+fields.join(',')+') values ('+values.join(',') +')' ;
    // 拼接字符串
    sql += sqlInsert;
    sqlClient.query(sql,[data.name,data.cover,data.cover_link,data.priority],function(err, rows){
        if(err){
            return  cb&&cb(err, null);
        }else{
            if(rows.insertId > 0){
                return cb&&cb(null, {bannerId:rows.insertId});
            }
            else{
                return cb&&cb(null, {bannerId:0});
            }
        }
    })

}

bannerDao.delBanner = function(bannerId,cb){
    var sql='update tb_banner set status = 0 where status = 1 and id = '+bannerId;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}