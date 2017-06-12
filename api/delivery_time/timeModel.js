var sqlClient = require('../lib/mysql/mysql');
var timeDao = module.exports;
var moment = require('moment');

timeDao.getTimeList = function(company_id,cb){
    var sql = "select * from delivery_time where status = 1 and company_id = "+company_id;
    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }

        return cb && cb(null, data);
    })
}

timeDao.addDeliveryTime = function(data,cb){
    console.log(data);
    var nowTime=moment().format("YYYY-MM-DD HH:mm:ss");
    var sql = '';
    var fields = [
        'company_id',
        'district_ids',
        'district_names',
        'delivery_time',
        'status',
        'create_time',
        'update_time'
    ];
    var values=[
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?'
    ];

    var sqlInsert = 'insert into delivery_time ('+fields.join(',')+') values ('+values.join(',') +')' ;
    // 拼接字符串
    sql += sqlInsert;
    console.log(sql);
    sqlClient.query(sql,[data.company_id,data.district_ids,data.district_names,
        data.delivery_time,1,nowTime,nowTime],function(err, rows){
        if(err){
            return  cb&&cb(err, null);
        }else{
            if(rows.insertId > 0){
                return cb&&cb(null, {delivery_time_id:rows.insertId});
            }
            else{
                return cb&&cb(null, {delivery_time_id:0});
            }
        }
    })

}

timeDao.delDeliveryTime = function(delivery_time_id,cb){
    var sql='update delivery_time set status = 0 where status = 1 and id = '+delivery_time_id;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}