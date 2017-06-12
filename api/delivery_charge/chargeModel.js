/**
 * Created by wei on 16/1/25.
 */
var chargeDao = module.exports;
var moment = require('moment');//moment库是一个时间处理的库
var sqlClient = require('../lib/mysql/mysql');
chargeDao.isDeliveryTemplateNmaeExsit = function (data,cb) {
    var sql ='select * from delivery_template where statue=1 and deliveryTemplateName="'+data.deliveryTemplateName+'" and company_id='+data.company_id;
    console.log(sql)
    sqlClient.query(sql,null, function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }
        if(data.length>0){
            return cb&&cb(null,"yes");
        }
        else{
            return cb&&cb(null,"no");
        }
    })
}
chargeDao.getShippingTemplate= function (data,cb) {
    var sql='';
    var sqlSelect='select * from shippingTemplate where statue=1 and company_id='+data.company_id +' and deliveryTemplateId='+data.deliveryTemplateId;
    console.log(sqlSelect)
    sqlClient.query(sqlSelect,null,function (err,data) {
        console.log(sqlSelect)
        if(err){
            console.log('ffff')
            return  cb&&cb(err, null);
        }
        else{
            if(data.length>0){
                getShippingRule(data[0],function (err,res) {
                    if(err){
                        return  cb&&cb(err, null);
                    }
                    data[0].shippingRules=res
                    return cb&&cb(null,data);
                })
            }
          else{
                return cb&&cb(null,data);
            }
        }
    })
}

chargeDao.getDeliveryTemplate = function (data,cb) {
    var sql='';
    var sqlSelect='select * from delivery_template where statue=1 and company_id='+data.company_id +' and deliveryTemplateId='+data.deliveryTemplateId;
    console.log(sqlSelect);
    sqlClient.query(sqlSelect,null,function (err,data) {
        console.log(sqlSelect)
        if(err){
            console.log('ffff')
            return  cb&&cb(err, null);
        }
        else{
            data[0].delivery_charge=data[0].delivery_charge/1000;
            data[0].extra_charge=data[0].extra_charge/1000
                    getRule(data[0],function (err,res) {
                        if(err){
                            return  cb&&cb(err, null);
                        }
                        data[0].rules=res
                            return cb&&cb(null,data[0]);
                    })
        }
    })
}

chargeDao.getShippingRuleCount=function(deliveryTemplateId,cb){
    var sql='';
    var sqlSelect='select count(shipping_rule_id) as shippingRuleCount ';
    var sqlFrom='from shippingRule ';
    var sqlJoin=' left join shippingTemplate on shippingTemplate.shippingTemplate_id=shippingRule.shippingTemplate_id';
    var sqlCondition=' where deliveryTemplateId='+deliveryTemplateId;
    sql=sqlSelect+sqlFrom+sqlJoin+sqlCondition;
    console.log(sql);
    sqlClient.query(sql,null,function (err,data){
        if(err){
            console.log('ffff')
            return  cb&&cb(err, null);
        }

        return cb&&cb(null, data[0].shippingRuleCount);
    })
}


chargeDao.getDeliveryTemplates = function (data,cb) {
    var sql='';
    var sqlSelect='select * from delivery_template where statue=1 and company_id='+data.company_id +' order by updateTime desc limit ?,?';
    var sqlcount ='select count(deliveryTemplateId) as total from delivery_template where statue=1 and company_id='+data.company_id
    console.log(sqlSelect)
    sqlClient.query(sqlSelect,[parseInt((data.page - 1) * data.pageSize),parseInt(data.pageSize)],function (err,data) {
        console.log(sqlSelect)
        if(err){
            console.log('ffff')
            return  cb&&cb(err, null);
        }
        else{
            var i=0;
            sqlClient.query(sqlcount,null,function (err,total) {
                if(err){
                    console.log('eeeee')
                    return  cb&&cb(err, null);
                }
                var response={
                    data:data,
                    count:total[0].total
                }
                if(data.length>0){
                    data.forEach(function (item) {
                        item.delivery_charge=item.delivery_charge/1000;
                        item.extra_charge=item.extra_charge/1000
                        console.log('ddddd')
                        getRule(item,function (err,res) {
                            if(err){
                                return  cb&&cb(err, null);
                            }
                            i++;
                            item.rules=res
                            if(i==data.length){
                                return cb&&cb(null,response);
                            }
                        })
                    })
                }else{
                    return cb&&cb(null,response);
                }

            })

        }
    })
}

var getRule =function(data,cb){
    var sqlSelect='select * from rule where statue=1 and deliveryTemplateId='+data.deliveryTemplateId;
    console.log(sqlSelect)
    sqlClient.query(sqlSelect,null,function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }else{
            data.forEach(function (item) {
                item.first_charge=item.first_charge/1000;
                item.extra_charge=item.extra_charge/1000
            })
            return cb&&cb(null,data);
        }
    })
}
var getShippingRule =function(data,cb){
    console.log(data)
    var sqlSelect='select * from shippingRule where statue=1 and shippingTemplate_id='+data.shippingTemplate_id;
    console.log(sqlSelect)
    sqlClient.query(sqlSelect,null,function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }else{
            data.forEach(function (item) {
                item.isShippingFreeCondition=item.isShippingFreeCondition/1000;
            })
            return cb&&cb(null,data);
        }
    })
}


chargeDao.addDeliveryTemplate = function (data,cb) {
    var sql='';
    var fields=[
        'deliveryTemplateName',
        'frequence',
        'isShippingFree',
        'first_cases',
        'delivery_charge',
        'step',
        'extra_charge',
       'addTime',
        'statue',
        'company_id',
        'updateTime'
    ]
    var values=[
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        'now()',
        '1',
        '?',
        "now()"
    ]
    var sqlInsert = 'insert into delivery_template ('+fields.join(',')+') values ('+values.join(',') +')' ;
    sqlClient.query(sqlInsert,[data.deliveryTemplateName,data.frequence,data.isShippingFree,data.first_cases,data.delivery_charge*1000,data.step,data.extra_charge*1000,data.company_id],
    function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }
        return cb&&cb(null,data);
    })
}

var addRule = function (data,cb) {
    var sql='';
    var fields=[
        'areas_name',
        'areas_id',
        'first_cases',
        'step',
        'first_charge',
        'extra_charge',
        'deliveryTemplateId',
        'statue'
    ];
    var values=[
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?'
    ]
    var sqlInsert ='insert into rule ('+fields.join(',')+') values ('+values.join(',') +')';
    sqlClient.query(sqlInsert,[data.areas_name,data.areas_id,data.first_cases,data.step,data.first_charge*1000,data.extra_charge*1000,data.insertId,data.statue], function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }
        return cb&&cb(null,data);
    })
}
chargeDao.addRules = function (data,cb) {
    console.log(data);
    var i=0;
    var response=[];
    data.forEach(function (item) {
        addRule(item, function (err,res) {
            if(err){
                return  cb&&cb(err, null);
            }
            i++;
            response.push(res)
            if(i==data.length){
                return  cb&&cb(null, response);
            }
        })
    })
}
chargeDao.addShippingTemplate = function (data,cb) {
    var sql='';
    var fields=[
        'shippingTemplate_name',
        'deliveryTemplateId',
       ' addTime',
        'statue',
        'company_id',
        'updateTime'
    ];
    var values=[
        '?',
        '?',
        'now()',
        '1',
        '?',
        'now()'
    ]
    var sqlInsert ='insert into shippingTemplate ('+fields.join(',')+') values ('+values.join(',') +')';
    console.log(sqlInsert)
    sqlClient.query(sqlInsert,[data.shippingFreeTemplateName,data.deliveryTemplateId,data.company_id], function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }
        return cb&&cb(null,data);
    })
}
var addShippingRule = function (data,cb) {
    var sql='';
    var fields=[
        'areas_name',
        'areas_id',
        'isShippingFreeCondition',
        'shippingTemplate_id',
        'statue',
    ];
    var values=[
        '?',
        '?',
        '?',
        '?',
        '?'
    ]
    var sqlInsert ='insert into shippingRule ('+fields.join(',')+') values ('+values.join(',') +')';
    sqlClient.query(sqlInsert,[data.areas_name,data.areas_id,data.isShippingFreeCondition*1000,data.insertId,data.statue], function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }
        return cb&&cb(null,data);
    })
}

chargeDao.addShippingRules =function(data,cb){
    console.log(data);
    var i=0;
    var response=[];
    data.forEach(function (item) {
        addShippingRule(item, function (err,res) {
            if(err){
                return  cb&&cb(err, null);
            }
            i++;
            response.push(res)
            if(i==data.length){
                return  cb&&cb(null, response);
            }
        })
    })
}
chargeDao.delDeliveryTemplate = function (data,cb) {
    var sqlUpdate='update delivery_template set statue=0 where deliveryTemplateId='+data;
    sqlClient.query(sqlUpdate,null, function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data);
    })
}
chargeDao.updateDeliveryTemplate = function (data,cb) {
    var deliveryTemplateId=data.deliveryTemplateId;
    var fields=[
        'deliveryTemplateName=?',
        'frequence=?',
        'isShippingFree=?',
        'first_cases=?',
        'delivery_charge=?',
        'step=?',
        'extra_charge=?',
    ]
    var sqlInsert = 'update delivery_template set '+fields.join(",") +' where deliveryTemplateId='+data.deliveryTemplateId;
    console.log(sqlInsert)
    sqlClient.query(sqlInsert,[data.deliveryTemplateName,data.frequence,data.isShippingFree,data.first_cases,data.delivery_charge*1000,data.step,data.extra_charge*1000],
        function(err,data){
            if(err){
                return  cb&&cb(err, null);
            }
            delRule(deliveryTemplateId,function(err,data){
                if(err){
                    return  cb&&cb(err, null);
                }
                return  cb&&cb(null, data);
            })

        })
}
var delRule = function (data,cb) {
    var updateSql="update rule set statue=0 where deliveryTemplateId="+data
    sqlClient.query(updateSql,null, function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data);
    })
}
chargeDao.updateShippingTemplate = function (data,cb) {
    var shippingTemplate_id=data.shippingTemplate_id;
    var fields=[
       'shippingTemplate_name=?'
    ]
    var sqlInsert = 'update shippingTemplate set '+fields.join(",") +' where shippingTemplate_id='+data.shippingTemplate_id;
    console.log(sqlInsert)
    sqlClient.query(sqlInsert,[data.shippingTemplate_name], function(err,data){
            if(err){
                return  cb&&cb(err, null);
            }
            delShippingRule(shippingTemplate_id,function(err,data){
                if(err){
                    return  cb&&cb(err, null);
                }
                return  cb&&cb(null, data);
            })

        })
}
var delShippingRule = function (data,cb) {
    var updateSql="update shippingRule set statue=0 where shippingTemplate_id="+data
    sqlClient.query(updateSql,null, function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data);
    })
}
chargeDao.getAllDeliveryTemplate = function (data,cb) {
    var sql='select * from delivery_template where statue=1 and company_id='+data;
    sqlClient.query(sql,null, function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data);
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
