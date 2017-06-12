/**
 * Created by wei on 16/1/25.
 */
var accountDao = module.exports;
var sqlClient = require('../lib/mysql/mysql');
var moment = require('moment');//moment库是一个时间处理的库
var path=require('path')
var XLS=require('xlsjs')
var XLSX = require('xlsx');

accountDao.getDeliverNo= function (cb) {
    var i=0;
    var orderDetail=[];
    var workbook = XLSX.readFile('a1.xlsx');
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(y) { /* iterate through sheets */
        var worksheet = workbook.Sheets[y];

        for (z in worksheet) {

            if(z[0] === '!') continue;
            /* all keys that do not begin with "!" correspond to cell addresses */
            orderDetail[i]=worksheet[z].v
            i++
            console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
        }
    });
     return cb&&cb(null, orderDetail);
}

accountDao.isHasNewOrder = function (cb) {
    var sql='';
    sql ='select company_id from company_orders where company_orders_add_date > date_sub(CURDATE(),interval 9 hour) and  company_orders_add_date < date_add(CURDATE(),interval 15 hour) and company_orders_status_id=1'
    sqlClient.query(sql,null,function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }
        else{
            return cb&&cb(null, {result:data});
        }
    })
}
accountDao.getCompanys=function(data,cb){
    var sql='';
    sql ='select remind_phone,remind_email,delivery_remind from company where company_id ='+data;
    sqlClient.query(sql,null,function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }
        else{
            return cb&&cb(null, {result:data});
        }
    })
}
/**
 * @desc 修改供应商账号信息
 * @param {func} cb 回调函数
 */

accountDao.chgAccount=function(data,cb){

    console.log(data);
    var sql = '';
    var fields = [
        'company_passwd = ?', // 配送点状态名称
        'company_nickname = ?', // 修改时间
        'company_phone = ?',
        'company_pay_tag = ?',
        'company_account = ?',
        'headimgurl = ?',
        'account_changed = ?',
        'company_introduction = ?'
    ];
    var sqlCondition = 'where company_id='+data.company_id;
    var sqlupdate = 'update company set '+fields.join(',')+' ';

    // 拼接字符串
    sql += sqlupdate+sqlCondition;
    console.log(sql);
  sqlClient.query(sql,[data.company_passwd,data.company_nickname,data.company_phone,data.company_pay_tag,data.company_account,data.headimgurl,data.account_changed,data.company_introduction],function(err,data){
      if(err){
          return  cb&&cb(err, null);
      }else{
          console.log(data);
          return cb&&cb(null, {result:200});
      }
  })
}

/**
 * @desc 获取供应商账号信息
 * @param {func} cb 回调函数
 */

accountDao.getAccount=function(data,cb){

    var sql = '';
    var fields = [
        'company_passwd', // 供应商密码
        'company_nickname', // 供应商昵称
        'company_phone',//供应商电话
        'company_pay_tag',//提现申请标志
        'company_account',//供应商账号
        'headimgurl',//头像url
        'company_money',//供应商资金
        'company_integration',//供应商积分
        'account_changed',//公司银行账号是否变动
        'billing_cycle',//结算周期
        'company_introduction',//供应商简介
        'apply_date',//上次提现时间
        'company_address',//供应商的详细地址
        'company_name',//供应商名称
        'creat_date'//创建时间
    ];
    var sqlCondition = 'where company_id='+data.company_id;
    var sqlupdate = 'select '+fields.join(',')+' from company  ';

    // 拼接字符串
    sql += sqlupdate+sqlCondition;
    sqlClient.query(sql,null,function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(data);
            data[0].creat_date=moment(data[0].creat_date).format('YYYY-MM-DD');
            if(data[0].apply_date){
                data[0].apply_date=moment(data[0].apply_date).format('YYYY-MM-DD');
            }else{
                data[0].apply_date='暂无';
            }


            return cb&&cb(null, {result:data});
        }
    })
}


/**
 * @desc 供应商登录
 * @param {func} cb 回调函数
 */

accountDao.login=function(data,cb){

    var sql = '';
    var fields = [
        'company_passwd', //
        'company_nickname', //
        'company_phone',
        'company_pay_tag',
        'company_account',
        'headimgurl',
        'company_money',
        'company_integration',
        'company_id',
        'company_type'
    ];
    var sqlCondition = 'where company_usrname = ?  and company_passwd = ?';
    var sqlupdate = 'select '+fields.join(',')+' from company  ';

    // 拼接字符串
    sql += sqlupdate+sqlCondition;
    console.log('ede')
    console.log(sql);
    sqlClient.query(sql,[data.company_usrname,data.company_passwd],function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log('sdfsfsdf');
            console.log(data);
            if(!data){
                data=[];
            }
            return cb&&cb(null, {result:data});
        }
    })
}

/**
 * @desc 提现明细
 * @param {func} cb 回调函数
 */
accountDao.getWithdrawDetail=function(data,cb){
    var sql = '';
    var fields = [
        'money', // 提现金额
        'account', // 提现账号
        'add_date'//提现日期
    ];
    var sqlCondition = 'where company_id='+data.company_id;
    var sqlupdate = 'select '+fields.join(',')+' from company_withdraw_details ';

    // 拼接字符串
    sql += sqlupdate+sqlCondition+' limit ?,?';
    if (data.page == 0) {
        data.page = 1;
    }
    sqlClient.query(sql,[parseInt((data.page - 1) * data.size), parseInt(data.size)],function(err,res){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(res);
            res.forEach(function(item){
                item.add_date=moment(item.add_date).format('YYYY-MM-DD HH:mm:ss');
                item.account=code(item.account);
            })
            var countSql='select count(id) as number from company_withdraw_details where company_id='+data.company_id;
            sqlClient.query(countSql,null,function(err,number){
                if(err){
                    return  cb&&cb(err, null);
                }else {
                    return cb&&cb(null, {result:res,counts:number[0].number});
                }
            })
        }
    })
}

//供应商获取发货单列表
accountDao.getOrders=function(data,cb){
    var sql = '';
    var fields = [
        'company_orders.company_orders_id',//发货单id
        'company_orders.company_orders_send_date',//发货时间
        'company_orders.express_no', // 快递单号
        'company_orders.order_no',//订单号
         'company_orders_status_id',
        'deliver_charges',
        'delivery_sites.site_name',//配送点
        'company_orders.deliver_address',//配送地址
        'company_orders.receiver_name',//收货人名称
        'company_orders.deliver_phone',//收货人电话
        'deadline_time',//截至日期
        'cities.city_name',//城市名称
        'fresh'//是否是生鲜
    ];
    var sqlCondition = ' where company_orders.company_id= '+data.company_id;
    var sqlupdate = 'select '+fields.join(',')+' from company_orders ';
    var leftJoin='left join delivery_sites on company_orders.site_id = delivery_sites.site_id ';
    leftJoin+=' left join cities on delivery_sites.city_id = cities.city_id ';
    if(data.company_orders_status_id&&parseInt(data.company_orders_status_id)!=0){
        sqlCondition+=' and   company_orders.company_orders_status_id = '+data.company_orders_status_id;
    }
    if(data.order_no){
        sqlCondition+=" and   company_orders.order_no like \'%" + data.order_no  + "%\'";
    }
    if(data.dateEnd&&!data.dateStart){
        sqlCondition += ' and company_orders.deadline_time < "'+data.dateEnd+'"  ';
    }
    if(!data.dateEnd&&data.dateStart){
        sqlCondition += ' and company_orders.deadline_time > "'+data.dateStart+'"  ';
    }
    if(data.dateEnd&&data.dateStart){
        sqlCondition += ' and company_orders.deadline_time > "'+data.dateStart+'" and company_orders.deadline_time < "'+data.dateEnd+'"  ';
    }
    sql += sqlupdate+leftJoin+sqlCondition+'  order by  company_orders_add_date desc limit ?,?';
    if (data.page == 0) {
        data.page = 1;
    }
    console.log(sql);
    sqlClient.query(sql,[parseInt((data.page - 1) * data.size), parseInt(data.size)],function(err,arr){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(arr);
            var countSql='select count(company_orders.company_orders_id) as number from company_orders '+sqlCondition;
            sqlClient.query(countSql,null,function(err,res){
                if(err){
                    return cb&&cb(err, null);
                }
                console.log(res);

                var i = 0;
                if(arr.length!=0){
                    arr.forEach(function(item){
                        item.deadline_time=moment(item.deadline_time).format('YYYY-MM-DD HH:00:00');
                        if(item.company_orders_send_date)item.company_orders_send_date=moment(item.company_orders_send_date).format('YYYY-MM-DD HH:mm:ss');
                        else{item.company_orders_send_date='等待送货'}
                        getOrderItemSku(item,function(err,data){
                            if(err){
                                return cb&&cb(err, null);
                            }else{
                                i++;
                                if(i==arr.length){
                                    console.log(arr);
                                    return cb&&cb(null, {result:arr,counts:res[0].number});
                                }
                            }
                        })
                    })
                }else{
                    return cb&&cb(null, {result:arr,counts:res[0].number});
                }
            })
        }
    })
}

//获取发货单的商品
function getOrderItemSku(data,cb){

        var sql = '';
        var fields = [
          'company_orders_items.company_goods_norms',//商品规格
            'company_orders_items.company_orders_goods_quantity',//商品数量
            'company_goods_name'//商品名称
        ];
        var sqlCondition = 'where company_orders_id = '+data.company_orders_id;
        var sqlupdate = 'select '+fields.join(',')+' from company_orders_items  ';
    var leftJoin=' left join company_goods_sku on company_orders_items.company_goods_sku_id = company_goods_sku.company_goods_sku_id ';
    leftJoin+=' left join company_goods on company_goods_sku.company_goods_id =  company_goods.company_goods_id ';
        // 拼接字符串
        sql += sqlupdate+leftJoin+sqlCondition;
        console.log(sql);
    sqlClient.query(sql,null,function(err, res){
            if(err){
                cb(err,null);
            }else{
                data.goods=res;
                cb(null,res);
            }
        })

}



//供应商修改发货单状态
accountDao.chgOrderStatue=function(data,cb){
    var sql = '';

    if(data.order_no.indexOf('S')!=-1){
        var fields = [
            'company_orders.company_orders_status_id = 2 ',
            'company_orders_send_date = now()',
        ];
        var sqlCondition = 'where company_orders.company_orders_status_id=1 and company_orders.order_no = "'+data.order_no+'"';
        var sqlupdate = 'update company_orders,orders set '+fields.join(',')+' ';
    }else{
        var fields = [
            'company_orders.company_orders_status_id = 2 ',
            'company_orders.express_no = "'+data.express_no+'"',
            'company_orders_send_date = now()',
            'company_orders.deliver_charges='+(data.deliver_charges*1000),
            'company_orders.express_company_code="'+data.express_company_code+'"'
          //  'orders.order_status_id=4',
           // 'orders.order_status="待收货"'
        ];
        var sqlCondition = 'where company_orders.company_orders_status_id=1 and company_orders.company_orders_id = '+data.company_orders_id;//+' and orders.order_no="'+data.order_no+'"';
        var sqlupdate = 'update company_orders,orders set '+fields.join(',')+' ';
    }

    // 拼接字符串
    sql += sqlupdate+sqlCondition;
    console.log(sql)
    sqlClient.query(sql,null,function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(data);
            return cb&&cb(null, {result:200});
        }
    })
}

//修改发货单状态的同时，也要讲订单信息存放到child_orders表里
accountDao.updateChildOrders=function(data){
    var sqlUpdate="update child_orders set express_no='"+data.express_no+"',express_company_code='"+data.express_company_code+"'";
    var sqlCondition=" where company_id="+data.company_id+" and order_no="+data.order_no;
    var sql=sqlUpdate+sqlCondition;
    console.log(sql);
    sqlClient.query(sql,null,function(err,data){
        if(err){
            console.log(err);
            return err;
        }else{
            console.log(data);
        }
    })
}

//修改完发货单后，判断订单是否属于有赞订单（订单号长度为28）,查询该订单ID对应商品的oid
accountDao.getOids=function(company_orders_id,cb){
    var sql='select oid from company_orders_items where company_orders_id='+company_orders_id;
    console.log(sql);
    sqlClient.query(sql,null,function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(data);
            return cb&&cb(null, data);
        }
    })

}


//获取所有发货单的状态
accountDao.getOrderStatue=function(data,cb){
    var sql = '';
    var fields = [
        'company_orders_status_id',
        'company_orders_status_name'
    ];
    var sqlSelect = 'select '+fields.join(',')+' from company_orders_status';
    // 拼接字符串
    sql += sqlSelect;
    sqlClient.query(sql,null,function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(data);
            return cb&&cb(null, data);
        }
    })
}
accountDao.updateRemindInformation=function(data,cb){
    var sql='';
    var fields=[
        'remind_phone="'+data.phone+'"',
        'remind_email="'+data.toEmail+'"',
        'delivery_remind='+data.isNeeded
    ];
    var sqlUpdate='update company set '+fields.join(',') +' where company_id='+data.company_id
    console.log(sqlUpdate)
    sqlClient.query(sqlUpdate,null,function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(data);
            return cb&&cb(null, data);
        }
    })
}
accountDao.selectRemindInformation=function(data,cb){
    var sql='';
    var fields=[
        'remind_phone',
        'remind_email',
        'delivery_remind'
    ];
    var sqlSelect='select '+fields.join(',') +' from company where company_id='+data.company_id
    console.log(sqlSelect);
    sqlClient.query(sqlSelect,null,function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(data);
            return cb&&cb(null, data);
        }
    })
}
accountDao.findByCondition = function (condition, page, size, cb) {
    var sql = '';
    var fields = [
        'company_orders.company_orders_id',//发货单id
        'company_orders.company_orders_send_date',//发货时间
        'company_orders.express_no', // 快递单号
        'company_orders.order_no',//订单号
        'company_orders_status_id',
        'deliver_charges',
        'delivery_sites.site_name',//配送点
        'company_orders.deliver_address',//配送地址
        'company_orders.receiver_name',//收货人名称
        'company_orders.deliver_phone',//收货人电话
        'deadline_time',//截至日期
        'cities.city_name',//城市名称
        'fresh'//是否是生鲜
    ];
    var sqlCondition = ' where company_orders.company_id= '+condition.company_id;
    var sqlupdate = 'select '+fields.join(',')+' from company_orders ';
    var leftJoin='left join delivery_sites on company_orders.site_id = delivery_sites.site_id ';
    leftJoin+=' left join cities on delivery_sites.city_id = cities.city_id ';
    if(condition.company_orders_status_id&&parseInt(condition.company_orders_status_id)!=0){
        sqlCondition+=' and   company_orders.company_orders_status_id = '+condition.company_orders_status_id;
    }
/*    if(data.order_no){
        sqlCondition+=" and   company_orders.order_no like \'%" + data.order_no  + "%\'";
    }
    if(data.dateEnd&&!data.dateStart){
        sqlCondition += ' and company_orders.deadline_time < "'+data.dateEnd+'"  ';
    }
    if(!data.dateEnd&&data.dateStart){
        sqlCondition += ' and company_orders.deadline_time > "'+data.dateStart+'"  ';
    }
    if(data.dateEnd&&data.dateStart){
        sqlCondition += ' and company_orders.deadline_time > "'+data.dateStart+'" and company_orders.deadline_time < "'+data.dateEnd+'"  ';
    }*/
    sql += sqlupdate+leftJoin+sqlCondition+'  order by  company_orders_add_date desc ';
    if (page == 0) {
        page = 1;
    }
    console.log(sql);
    sqlClient.query(sql,null,function(err,arr){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(arr);
            var countSql='select count(company_orders.company_orders_id) as number from company_orders '+sqlCondition;
            sqlClient.query(countSql,null,function(err,res){
                if(err){
                    return cb&&cb(err, null);
                }
                console.log(res);

                var i = 0;
                if(arr.length!=0){
                    arr.forEach(function(item){
                        item.deadline_time=moment(item.deadline_time).format('YYYY-MM-DD HH:00:00');
                        if(item.company_orders_send_date)item.company_orders_send_date=moment(item.company_orders_send_date).format('YYYY-MM-DD HH:mm:ss');
                        else{item.company_orders_send_date='等待送货'}
                        getOrderItemSku(item,function(err,data){
                            if(err){
                                return cb&&cb(err, null);
                            }else{
                                i++;
                                if(i==arr.length){
                                    console.log(arr);
                                    return cb&&cb(null, {result:arr,counts:res[0].number});
                                }
                            }
                        })
                    })
                }else{
                    return cb&&cb(null, {result:arr,counts:res[0].number});
                }
            })
        }
    })
}

//获取店铺信息
accountDao.getStore =function(data,cb){
    var sql='';
    var sqlSelect='select * from store where statue=1 and company_id='+data.company_id;
    console.log(sqlSelect);
    sqlClient.query(sqlSelect,null, function (err,data) {
        if(err){
            return cb&&cb(err, null);
        }

        return cb&&cb(null, data);
    })
}

//获取正在使用的包邮模板
accountDao.getShippingTemplate=function(company_id,cb){
    var fields=[
        'shippingTemplate_id',
        'shippingTemplate_name'
    ];
    var sqlSelect='select '+fields.join(',');
    var sqlFrom=' from shippingTemplate';
    var sqlJoin=' left join company on shippingTemplate_id=shipping_template_id';
    var sqlCondition=' where company.company_id='+company_id;
    var sql=sqlSelect+sqlFrom+sqlJoin+sqlCondition;
    sqlClient.query(sql,null, function (err,data) {
        if(err){
            return cb&&cb(err, null);
        }
        return cb&&cb(null, data);
    })

}

//获取全部的包邮模板
accountDao.getAllShippingTemplate=function(company_id,cb){
    var fields=[
        'shippingTemplate_id',
        'shippingTemplate_name'
    ];
    var sqlSelect='select '+fields.join(',');
    var sqlFrom=' from shippingTemplate';
    var sqlCondition=' where company_id='+company_id;
    var sql=sqlSelect+sqlFrom+sqlCondition;
    sqlClient.query(sql,null, function (err,data) {
        if(err){
            return cb&&cb(err, null);
        }
        return cb&&cb(null, data);
    })

}

accountDao.addStore =function(data,cb){
    var sql='';
    var fields=[
        'company_id',
        'statue',
        'store_describtion',
        'store_detail_img',
        'store_name',
        'store_logo',
        'create_time',
        'audit_statue'//审核状态，1表示待审核，2表示审核通过，3表示审核失败
    ]
    var values=[
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        'now()',
        '?'
    ];
    var sqlSelect='insert  into store ('+fields.join(',')+') values ('+values.join(',') +')' ;
    console.log(sqlSelect)
    sqlClient.query(sqlSelect,[data.company_id,1,data.store_describtion,data.store_detail_img,data.store_name,data.store_logo,1],function(err,res){
        if(err){
            return cb&&cb(err, null);
        }
        return cb&&cb(null, res);
    })
}
accountDao.updateStore =function(data,cb){
    var sql='';
    var fields=[
        'store_describtion=?',
        'store_detail_img=?',
        'store_name=?',
        'store_logo=?',
        'audit_statue=?'
    ]
    var sqlSelect='update store set '+fields.join(',');
    var sqlCondition=' where store_id='+data.store_id
    sql=sqlSelect+sqlCondition;
    console.log(sql)
    sqlClient.query(sql,[data.store_describtion,data.store_detail_img,data.store_name,data.store_logo,1],function(err,res){
        if(err){
            return cb&&cb(err, null);
        }
        return cb&&cb(null, res);
    })
}

accountDao.updateCompany=function(shippingTemplate_id,company_id,cb){
    var sql='update company set shipping_template_id='+shippingTemplate_id+' where company_id='+company_id;
    console.log(sql)
    sqlClient.query(sql,null,function(err,res){
        if(err){
            return cb&&cb(err, null);
        }

    })
}



accountDao.getExcel =function(data,cb){
    console.log('dsds')
    console.log(data)
    var i=0;
    var orderDetail=[];
    if(data.extension=='xlsx'){

        var workbook = XLSX.readFile(data.path);
        var sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function(y) { /* iterate through sheets */
            console.log(y)
            console.log('ds')
            var worksheet = workbook.Sheets[y];
            console.log(worksheet)
            for (z in worksheet) {
                console.log('32')
                if(z[0] === '!') continue;
                /* all keys that do not begin with "!" correspond to cell addresses */
                orderDetail[i]=worksheet[z].v
                i++
                console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
            }
        });
    }
    if(data.extension=='xls'){
        console.log(data.extension)
        console.log('ssss')
        var workbook = XLS.readFile(data.path);
        var sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function(y) { /* iterate through sheets */
            console.log(y)
            console.log('ds')
            var worksheet = workbook.Sheets[y];
            console.log(worksheet)
            for (z in worksheet) {
                console.log('32')
                if(z[0] === '!') continue;
                /* all keys that do not begin with "!" correspond to cell addresses */
                orderDetail[i]=worksheet[z].v
                i++
                console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
            }
        });
    }
    return cb&&cb(null, orderDetail);
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
