var sqlClient = require('../lib/mysql/mysql');
var pinDao = module.exports;
var moment = require('moment');
//var pinJob=require('./pinJob');


pinDao.getPinActivity = function(data, cb){
    var sql = '';
    var fields = [
        'id',//活动id
        'activity_name', //活动名称
        'activity_start_time', // 活动开始时间
        'activity_end_time',// 活动结束时间
        'activity_status',//活动状态
        'activity_img',//活动商品图片
        'activity_cover'//活动背景图片
    ];
    var sqlCondition = 'where status = 1 ';
    var sqlSelect = 'select '+fields.join(',')+' ';
    var sqlFrom = 'from pin_activity ';

    // 按活动状态查询
    if(parseInt(data.activity_status)!=0){
        sqlCondition += ' and activity_status = '+data.activity_status;
    }

    // 按商户id查询
    if(parseInt(data.company_id)!=0){
        sqlCondition += ' and company_id = '+data.company_id;
    }

    //按活动名称查询
    if(data.activity_name){
        sqlCondition += ' and activity_name like \'%'+data.activity_name+'%\' ';
    }

    var countSql="select count(id) as total from pin_activity " + sqlCondition;
    // 拼接字符串
    sql += sqlSelect+sqlFrom+sqlCondition+' order by activity_start_time desc  limit ?,?';


    // page容错
    if (data.page == 0) {
        data.page = 1;
    }
    // 查询并返回结果
    console.log(sql);
    sqlClient.query(sql,[parseInt((data.page - 1) * data.size), parseInt(data.size)],function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        data.forEach(function(item){
            item.activity_start_time=moment(item.activity_start_time).format('YYYY-MM-DD HH:mm:ss');
            item.activity_end_time=moment(item.activity_end_time).format('YYYY-MM-DD HH:mm:ss');

        })

        sqlClient.query(countSql,null,function(err,results){
            var response={
                counts:results[0].total,
                data:data
            }
            console.log(response);
            return cb&&cb(null, response);
        });
    })
}

pinDao.getPinActivityDetail = function(data,cb){
    var sql = '';
    var fields = [
        'id',//活动id
        'activity_name', //活动名称
        'pin_activity.product_id',//商品的id
        'is_simulate',//是否模拟成团
        'is_head_discount',//是否开启团长优惠
        'head_discount',//团长优惠折扣
        'activity_start_time', // 活动开始时间
        'activity_end_time',// 活动结束时间
        'activity_status',//活动状态
        'activity_img',//活动商品图片
        'activity_cover',//活动背景图片
        'pin_activity_goods.activity_good_id',
        'pin_activity_goods.activity_id',
        'pin_activity_goods.product_id',
        'pin_activity_goods.sku_id',
        'pin_activity_goods.sku_norms',
        'pin_activity_goods.old_price',
        'pin_activity_goods.activity_price',
        'pin_activity_goods.buyer_number',
        'pin_activity_goods.status'
    ];
    var sqlCondition = 'where pin_activity.id = '+data.id+' and pin_activity_goods.status = 1' ;
    var sqlSelect = 'select '+fields.join(',')+' ';
    var sqlFrom = 'from pin_activity ';
    var sqlJoin = 'left join pin_activity_goods on pin_activity.id=pin_activity_goods.activity_id ';
    // 拼接字符串
    sql += sqlSelect+sqlFrom+sqlJoin+sqlCondition;
    console.log(sql);
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        console.log(data);

        var norms=[];
        data.forEach(function(item){
            item.old_price=item.old_price/1000;
            item.activity_price= item.activity_price/1000
            norms.push({activity_good_id:item.activity_good_id,product_id:item.product_id,
                sku_id:item.sku_id,sku_norms:item.sku_norms,status:1,old_price:item.old_price,
                activity_price:item.activity_price,buyer_number:item.buyer_number})

        })
        var goodDetail={};

        goodDetail.id=data[0].id;
        goodDetail.activity_name=data[0].activity_name;
        goodDetail.product_id=data[0].product_id;
        goodDetail.is_simulate=data[0].is_simulate;
        goodDetail.is_head_discount=data[0].is_head_discount;
        goodDetail.head_discount=data[0].head_discount;
        goodDetail.activity_start_time=moment(data[0].activity_start_time).format("YYYY-MM-DD HH:mm:ss");
        goodDetail.activity_end_time=moment(data[0].activity_end_time).format("YYYY-MM-DD HH:mm:ss");
        goodDetail.activity_status=data[0].activity_status;
        goodDetail.activity_img=data[0].activity_img;
        goodDetail.activity_cover=data[0].activity_cover;
        goodDetail.norms=norms;
        return cb&&cb(null,goodDetail);
    })
}

pinDao.addPinActivity = function(data,cb){
    console.log(data);
    var findSQL = 'select * from company_goods where company_goods_id = '+data.product_id;
    sqlClient.query(findSQL,null,function(err,findRows){
            if(err){
                return cb&&cb(err,null);
            }else{
                if(findRows.length!=0){
                    var nowTime=moment().format("YYYY-MM-DD HH:mm:ss");
                    var sql = '';
                    var fields = [
                        'activity_name', // 活动名称
                        'company_id',//创建商户的id
                        'activity_img',//活动商品图片
                        'activity_cover',//活动背景图片
                        'product_id',//商品的id
                        'category_id',//商品的分类id
                        'is_simulate',//是否模拟成团
                        'is_head_discount',//是否开启团长优惠
                        'head_discount',//团长优惠折扣
                        'activity_start_time', // 活动开始时间
                        'activity_end_time',//活动结束时间
                        'activity_status',//活动的状态
                        'activity_create_time', // 活动创建时间
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
                        '?',
                        '?'
                    ];

                    var sqlInsert = 'insert into pin_activity ('+fields.join(',')+') values ('+values.join(',') +')' ;
                    // 拼接字符串
                    sql += sqlInsert;
                    console.log(sql);
                    if(data.activity_cover == '' || data.activity_cover == null || data.activity_cover == undefined){
                        data.activity_cover = data.activity_img;
                    }
                    sqlClient.query(sql,[data.activity_name,data.company_id,data.activity_img,data.activity_cover,data.product_id,
                        findRows[0].company_goods_category_id,data.is_simulate,data.is_head_discount,data.head_discount,data.activity_start_time,
                        data.activity_end_time,2,nowTime,nowTime],function(err, rows){
                        if(err){
                            return  cb&&cb(err, null);
                        }else{
                            if(rows.insertId > 0){
                                addPinActivityGoods({norms:data.norms,activity_id:rows.insertId},function(err,irows){
                                    if(err){
                                        cb&&cb(err, null);
                                    }else{
                                        return cb&&cb(null, {activity_id:rows.insertId});
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })


    }
    function addPinActivityGoods(data,cb){
        var fields = [
            'activity_id', //团购活动的id
            'product_id',//商品的id
            'sku_id',//商品sku的id
            'sku_norms',//商品sku的规格
            'old_price',//原价
            'activity_price',//活动团购价
            'buyer_number',//团购人数
            'create_time'//创建时间
        ];
        var values=[];

        data.norms.forEach(function(item){
            item.old_price=parseInt(item.old_price*1000);
            item.activity_price=parseInt(item.activity_price*1000);
            values.push('('+data.activity_id+','+item.product_id+','+item.sku_id+',"'+item.sku_norms+'",'+item.old_price+','+item.activity_price+','+item.buyer_number+',now())');
        })

        var sqlInsert = 'insert into pin_activity_goods ('+fields.join(',')+') values'+values.join(',') ;
        console.log(sqlInsert);
        sqlClient.query(sqlInsert,null,function(err, data){
            if(err){
                return  cb&&cb(err, null);
            }
            console.log(data);
            return cb&&cb(null, data);
        })
    }

    pinDao.delPinActivity =function(activity_id,cb){
        var sql='update pin_activity set status = 0 where activity_status = 3 and status = 1 and id = '+activity_id;
        sqlClient.query(sql,null,function(err, data){
            if(err){
                return  cb&&cb(err, null);
            }
            return  cb&&cb(null, data.affectedRows);
        })
    }

    pinDao.updatePinActivity = function(data,cb){
        var findSQL = 'select * from company_goods where company_goods_id = '+data.product_id;
        sqlClient.query(findSQL,null,function(err,findRows) {
            if (err) {
                return cb && cb(err, null);
            } else {
                if (findRows.length != 0) {
                    var sql = '';
                    var fields = [
                        'activity_name = ?',
                        'company_id = ?',
                        'activity_img = ?',
                        'activity_cover = ?',
                        'product_id = ?',
                        'category_id = ?',
                        'is_simulate = ?',
                        'is_head_discount = ?',
                        'head_discount = ?',
                        'activity_start_time = ?',
                        'activity_end_time = ?'
                    ];
                    var sqlCondition = 'where id = '+data.id;
                    var sqlupdate = 'update pin_activity set '+fields.join(',')+' ';

                    // 拼接字符串
                    sql += sqlupdate+sqlCondition;
                    // 更新并返回结果
                    console.log(sql);
                    sqlClient.query(sql,[data.activity_name,data.company_id,data.activity_img,data.activity_cover,data.product_id,
                        findRows[0].company_goods_category_id,data.is_simulate,data.is_head_discount,data.head_discount,
                        data.activity_start_time,data.activity_end_time],function(err, res){
                        if(err){
                            return  cb&&cb(err, null);
                        }
                        updateActivityGood({norms:data.norms,activity_id:data.id},function(err,data){
                            if(err){
                                return  cb&&cb(err, null);
                            }else{
                                console.log(data);
                                return cb&&cb(null, {result:200});
                            }
                        })
                    })
                }
            }
        })

    }

    function updateActivityGood(data,cb){
        console.log(data)
        var values=[];
        data.norms.forEach(function(item){
            item.old_price=parseInt(item.old_price*1000);
            item.activity_price=parseInt(item.activity_price*1000);
            values.push('('+item.activity_good_id+','+data.activity_id+','+item.product_id+','+item.sku_id+',"'+item.sku_norms+'",'+item.old_price+','+item.activity_price+','+item.buyer_number+','+item.status+')');
        })

        var fields = [
            'activity_good_id',//团购商品的id
            'activity_id', //团购活动的id
            'product_id',//商品的id
            'sku_id',//商品sku的id
            'sku_norms',//商品sku的规格
            'old_price',//原价
            'activity_price',//活动团购价
            'buyer_number',//团购人数
            'status'
        ];

        var sqlupdate = 'insert into pin_activity_goods ('+fields.join(',')+') values'+values.join(',')
            +'ON DUPLICATE KEY UPDATE activity_id=values(activity_id),product_id=values(product_id),' +
            'sku_id=values(sku_id),sku_norms=values(sku_norms),old_price=values(old_price),' +
            'activity_price=values(activity_price),buyer_number=values(buyer_number),status=values(status)';

        console.log(sqlupdate);
        sqlClient.query(sqlupdate,null,function(err, data){
            if(err){
                return  cb&&cb(err, null);
            }
            console.log(data);
            return cb&&cb(null, data);
        })
    }

    pinDao.remPinActivity =function(activity_id,cb){
        var sql='update pin_activity set activity_status = 4 where status = 1 and id = '+activity_id;
        sqlClient.query(sql,null,function(err, data){
            if(err){
                return  cb&&cb(err, null);
            }else{
                //进行中的活动下架后已付款订单正常发货
                return  cb&&cb(null, data.affectedRows);
            }
        })
    }