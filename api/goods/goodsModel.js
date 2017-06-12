/**
 * Created by wei on 16/1/19.
 */
var commonDao=require('../common/common.js');
var sqlClient = require('../lib/mysql/mysql');
var goodsDao = module.exports;
var moment = require('moment');//moment库是一个时间处理的库

goodsDao.getCity = function(data,cb){

    var sql = "select * from cities where status = 1 and city_id= "+data;
console.log(sql)
    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }
        var response={
            city:'',
            province:''
        }
        console.log(data)
        response.city=data[0];
        console.log( response.city)
        var sql="select * from provinces where status=1 and province_id="+data[0].province_id;
        console.log(sql)
        sqlClient.query(sql,null, function (err,data) {
            if(err){
                return cb && cb(err, null);
            }
            response.province=data[0];
            console.log('wwwwwwwwwwwwww')
            console.log(response)
            return cb && cb(null, response);
        })

    })
}
// 城市
goodsDao.getCities = function(cb){

    var sql = "select * from cities where status = 1 ";

    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }
        return cb && cb(null, data);
    })
}
goodsDao.getDistricts = function(data,cb){

    var sql = "select * from districts where status = 1 and city_id = "+data.city_id;

    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }
        return cb && cb(null, data);
    })
}
goodsDao.getCitiesByProvinceId = function(data,cb){

    var sql = "select * from cities where status = 1 and province_id= "+data.province_id;

    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }
        return cb && cb(null, data);
    })
}
goodsDao.getProvinces = function(cb){

    var sql = "select * from provinces where status = 1 ";

    sqlClient.query(sql, null, function(err, data){
        if(err){
            return cb && cb(err, null);
        }
        return cb && cb(null, data);
    })
}

/**
 * @desc 获取商品分类
 * @func findByCondition
 * @param {object} condition 查询条件
 * @param {number} page 页码
 * @param {size} size 每页数据量
 * @param {func} cb 回调函数
 */
goodsDao.getCategory = function(data, cb){

    var sql = '';
    var fields = [
        'categories_id',//分类id
        'category_name'//分类名称
    ];
    var sqlCondition = 'where company_tag != 0 and category_status = 1 ';
    var sqlSelect = 'select '+fields.join(',')+' ';
    var sqlFrom = 'from categories ';
    // 拼接字符串
    sql += sqlSelect+sqlFrom+sqlCondition+' order by date_added';

    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return cb&&cb(null,data);
    })
}

/**
 * @desc 根据供应商id获取商品
 * @func findByCondition
 * @param {object} condition 查询条件
 * @param {number} page 页码
 * @param {size} size 每页数据量
 * @param {func} cb 回调函数
 */

goodsDao.getGoods = function (data,cb){
    //setSales_price(null,function(err,data)
    var sku_req =data;
    var sql = '';
    var fields = [
        'company_goods_activity_icon',
        'company_goods.company_goods_id',//商品id
        'company_goods_send',//是否支持快递
        'company_goods_fresh',//是否是订单驱动
        'auditResult',//审核描述
        'company_goods_name',//商品名称
        'company_goods_icon',//商品图标
        'company_goods_place',//商品产地
        'add_date',
        'company_goods_status.company_goods_status_name',//商品状态名称
        'company_goods.company_goods_status_id',
        'company_goods_audit',
        'company_goods_self_activity',
        'billing_type'
    ];
    var sqlCondition = ' where ';
    var sqlSelect = 'select '+fields.join(',')+' ';
    var sqlFrom = 'from company_goods ';
    var sqlJoin = ' left join company_goods_status on company_goods_status.company_goods_status_id=company_goods.company_goods_status_id ';
    // 按状态查询

    if(data.company_goods_status_id!=0){

        sqlCondition += 'company_goods.company_goods_status_id in ('+data.company_goods_status_id+') and ';
    }

    if(data.company_goods_name){
        sqlCondition += ' company_goods_name like \'%'+data.company_goods_name+'%\' and ';
    }
    // 订单时间范围查询
    if(data.dateEnd&&!data.dateStart){
        sqlCondition += ' company_goods.add_date < "'+data.dateEnd+'" and ';
    }
    if(!data.dateEnd&&data.dateStart){
        sqlCondition += ' company_goods.add_date > "'+data.dateStart+'" and ';
    }
    if(data.dateEnd&&data.dateStart){
        sqlCondition += ' company_goods.add_date > "'+data.dateStart+'" and company_goods.add_date < "'+data.dateEnd+'" and ';
    }

    if(data.isPromotionModule==true){
        if(data.audit==0) {
            sqlCondition +='company_id = '+data.company_id+' and company_goods.statue = 1 ';
        }
        if(data.audit==1) {
            sqlCondition +='company_id = '+data.company_id+' and company_goods.statue = 1 '+' and company_goods_self_activity = 1 ';
        }
        if(data.audit==2) {
            sqlCondition +='company_id = '+data.company_id+' and company_goods.statue = 1 '+' and company_goods_audit = 2 ';
        }
        if(data.audit==3) {
            sqlCondition +='company_id = '+data.company_id+' and company_goods.statue = 1 '+' and company_goods_audit = 3 ';
        }
        var sqlCount= 'select count(DISTINCT company_goods.company_goods_id) as number from company_goods left join company_goods_sku on company_goods.company_goods_id=company_goods_sku.company_goods_id where company_goods_sku_audit='+ data.audit+' and statue=1 and company_id='+data.company_id+' and company_goods_status_id=2 ';
    }
    else{
        sqlCondition +='company_id = '+data.company_id+' and company_goods.statue = 1 ';
        var sqlCount= 'select count(company_goods.company_goods_id) as number '+sqlFrom+sqlJoin+sqlCondition;
    }
    /* if(data.isPromotionModule==true)//判断是否为营销模块
     {
         if(data.sales_promotion=='1,2'){
             sqlCondition +='company_id = '+data.company_id+' and company_goods.statue = 1 '+' and company_goods.sales_promotion in (1,2)';
         }
         else{
             sqlCondition +='company_id = '+data.company_id+' and company_goods.statue = 1 '+' and company_goods.sales_promotion =0 ';
         }
     }
 else
     {
         sqlCondition +='company_id = '+data.company_id+' and company_goods.statue = 1 '
     }
*/
    // 拼接字符串
    sql += sqlSelect+sqlFrom+sqlJoin+sqlCondition+'  order by company_goods.update_time desc limit ?,?';
    // page容错
    if (data.page == 0) {
        data.page = 1;
    }
    // 查询并返回结果

    sqlClient.query(sql,[parseInt((data.page - 1) * data.size), parseInt(data.size)],function(err, data){
        var response={
            array:data,
            counts:0
        }
        var i=0;

        if(response.array.length>0){
            response.array.forEach(function(item){
                getSku(item,sku_req,function(err,data){
                    i++;
                    if(err){
                        return cb(err,null);
                    }else{
                        if(i==response.array.length){
                            sqlClient.query(sqlCount,null,function(err, data){
                                response.counts=data[0].number;
                                return cb&&cb(null,response);
                            })
                        }
                    }
                })

            })
        }else{
            sqlClient.query(sqlCount,null,function(err, data){
                response.counts=data[0].number;
                return cb&&cb(null,response);
            })
        }
    })
}
/*function setSales_price(data,cb){
    var sql = 'update company_goods_sku set company_goods_sale_price=company_goods_price';
    sqlClient.query(sql,null,function(err, res){
        if(err){
            cb(err,null);
        }
    })
}*/
function getGiftSku(data,sku_req,cb){
    console.log('asdasdadada');
    console.log(data);
    var sql = '';
    var fields = [
        'company_goods_sale_quantity', // 已售数量
        'company_goods_norms', // 商品规格
        'company_goods_price', //商品价格
        'company_goods_left_quantity',//商品剩余库存
        'init_quantity',//入库初始值
        'company_goods_sku.company_goods_id',
        'company_goods_sku_id',
        'company_goods_sku.company_goods_sale_price',
        'company_goods_sku.gift_sku_number',
        'company_goods_name'
    ];
    var sqlCondition='';
    //sqlCondition = ' where company_goods_sku_id in(select gift_sku_id from company_goods_sku where company_goods_sku.company_goods_id = '+goods_id +' and company_goods_sku.status = 1)';
    if(sku_req.audit==2){
        sqlCondition = ' where company_goods_sku_id ='+data.gift_sku_save_id;
    }
else{
        sqlCondition = ' where company_goods_sku_id ='+data.gift_sku_id;
    }
    var sqlupdate = 'select '+fields.join(',')+' from company_goods_sku  ';
    var join =' left join company_goods on company_goods.company_goods_id=company_goods_sku.company_goods_id ';
    // 拼接字符串
    sql += sqlupdate+join+sqlCondition;
    sqlClient.query(sql,null,function(err, res){
        if(err){
            cb(err,null);
        }else{
            res.forEach(function(item){
                item.company_goods_price=item.company_goods_price/1000;
            })
            data.giftskuArr=res;
            cb(null,res);
        }
    })
}


function getSku(data,sku_req,cb){
    var goods_id=data.company_goods_id;
    var sql = '';
    var fields=[];
    if(sku_req.audit==2){
        fields = [
            'company_goods_sale_quantity', // 已售数量
            'company_goods_norms', // 商品规格
            'company_goods_left_quantity',//商品剩余库存
            'init_quantity',//入库初始值
            'frequency',//发货频率
            'company_goods_sku.status',//sku的状态
            'company_goods_sku.company_goods_id',
            'company_goods_sku_id',
            'company_goods_sku.company_goods_sale_price',
            'company_goods_sku.discount_save_rate',
            'company_goods_name',
            'company_goods_sku_type',
            'company_goods_sku_audit',
            'gift_sku_save_id',
            'gift_sku_save_number',
            'company_goods_sku_save_price',
            'activity_start_time',
            'activity_end_time',
            'lowest_price',
            'activity_name',
            'in_price',
// HEAD
            'company_goods_sku_buy_number',
            'company_goods_sku_activity_id',
//
            'pre_price',
            'deliveryTemplateId'
// yunfei
        ];
        console.log('desdsa')

    }
  else{
        fields = [
            'company_goods_sale_quantity', // 已售数量
            'company_goods_norms', // 商品规格
            'company_goods_price', //商品价格
            'company_goods_left_quantity',//商品剩余库存
            'init_quantity',//入库初始值
            'frequency',//发货频率
            'company_goods_sku.status',//sku的状态
            'company_goods_sku.company_goods_id',
            'company_goods_sku_id',
            'company_goods_sku.company_goods_sale_price',
            'company_goods_sku.gift_sku_number',
            'company_goods_sku.discount_rate',
            'company_goods_name',
            'company_goods_sku_type',
            'company_goods_sku_audit',
            'gift_sku_id',
            'gift_sku_number',
            'company_goods_sku_save_price',
            'activity_start_time',
            'activity_end_time',
            'activity_name',
            'lowest_price',
            'in_price',
//HEAD
            'company_goods_sku_buy_number',
            'company_goods_sku_activity_id',
//
            'pre_price',
            'deliveryTemplateId'
// yunfei
        ];
    }
    var sqlCondition='';
    if(sku_req.isPromotionModule==true){

       /* if(sku_req.type=='0') {
            //sqlCondition = 'where company_goods_sku.company_goods_id = '+goods_id+' and company_goods_sku.status = 1';*/

       /* if(sku_req.type=='0') { //不搞活动
            sqlCondition = 'where company_goods_sku.company_goods_id = '+goods_id+' and company_goods_sku.status = 1'+' and company_goods_sku_type in(0)';
        }
        else
        {*/
             if(sku_req.audit==0){
                 sqlCondition = 'where company_goods_sku.company_goods_id = '+goods_id+' and company_goods_sku.status = 1'+' and company_goods_sku_audit=0';
             }
            if(sku_req.audit==1){
                sqlCondition = 'where company_goods_sku.company_goods_id = '+goods_id+' and company_goods_sku.status = 1'+' and company_goods_sku_type in(1,2,3)'+' and company_goods_sku_audit =1';
            }
            if(sku_req.audit==2){
                sqlCondition = 'where company_goods_sku.company_goods_id = '+goods_id+' and company_goods_sku.status = 1'+' and company_goods_sku_type in(1,2,3)'+' and company_goods_sku_audit =2';
            }
            if(sku_req.audit==3){
                sqlCondition = 'where company_goods_sku.company_goods_id = '+goods_id+' and company_goods_sku.status = 1'+' and company_goods_sku_type in(1,2,3)'+' and company_goods_sku_audit =3';
            }

    }
    else{
        sqlCondition = 'where company_goods_sku.company_goods_id = '+goods_id+' and company_goods_sku.status = 1';
    }

    var sqlupdate = 'select '+fields.join(',')+' from company_goods_sku  ';

    var join =' left join company_goods on company_goods.company_goods_id=company_goods_sku.company_goods_id ';

        join+=' left join activity on activity.activity_id=company_goods_sku.company_goods_sku_activity_id ';

    //join+=' left join activity on activity.activity_id=company_goods_sku.company_goods_sku_activity_id ';
    // 拼接字符串
    sql += sqlupdate+join+sqlCondition;
    console.log(sql);
    sqlClient.query(sql,null,function(err, res){

        if(err){
            cb(err,null);
        }else{
            res.forEach(function(item){
                item.company_goods_price=item.company_goods_price/1000;
                item.company_goods_sale_price=item.company_goods_sale_price/1000
                item.company_goods_sku_save_price=item.company_goods_sku_save_price/1000
                item.lowest_price= item.lowest_price/1000
                item.in_price= item.in_price/1000;
                getSalesQualityByDay(sku_req.company_id,item.company_goods_sku_id, function (err,data) {
                    if(err){
                        return cb(err,null);
                    }
                    item.total=data[0].total;
                })
                if(item.company_goods_sku_type==3){
                    console.log('sdfsfdsdfsfdsdfsd');
                    getGiftSku(item,sku_req,function(err,data){

                        if(err){
                            return cb(err,null);
                        }else{
                            item.giftSkuArray=data;
                            console.log('jiji')
                            console.log(data)
                        }
                    })
                }
            })
            data.skuArr=res;
            console.log('dada')
            console.log(data.skuArr)
            cb(null,res);
        }
    })
}




goodsDao.updateSalePrice= function(data,cb){
    var sql ='update company_goods_sku set company_goods_sale_price=company_goods_price,company_goods_sku_save_price=company_goods_price where company_goods_sku_id='+data.company_goods_sku_id;
    console.log(sql);
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        console.log('heheh')
        console.log(data);
        return cb&&cb(null, data);
    })
}

/**
 * @desc 根据商品id获取商品详情
 * @func findByCondition
 * @param {object} condition 查询条件
 * @param {func} cb 回调函数
 */

goodsDao.getGoodsDetail = function (data,cb){
    var sql = '';
    var fields = [
        'company_goods.company_goods_id',//商品id
        'company_goods_name',//商品名称
        'company_goods_icon',//商品图标
        'company_goods_desc',//商品简介
        'company_goods_detail_img',//商品详情页图片
        'company_goods_details',//商品详情描述
        'company_goods_place',//商品原产地
        'company_goods.auditResult',//商品审核结果
        'company_goods.company_goods_status_id',//商品状态id
        'company_goods_category_id',//商品分类id
        'temperature',//保存温度
        'save_days',//保存时间
        'areas_name',
        'areas_id',
        'sales_type',
        'pre_delivery_time',
        'repertory_place',
        'company_goods_status.company_goods_status_name',//商品状态名称
        'company_goods_sku.company_goods_sku_id',//商品sku_id
        'company_goods_sku.company_goods_price',//商品sku价格
        'company_goods_sku.company_goods_norms',//商品sku规格
        'company_goods_sku.company_goods_sale_price',
        'company_goods_sku.company_goods_left_quantity',//商品sku库存
        'company_goods_sku.company_goods_sale_quantity',//商品sku的销量
        'company_goods_sku.status',//商品sku的statue
        'company_goods_send',//商品是否支持快递
        'company_goods_repeat_send',//商品是否支持转发
        'company_goods_sku.init_quantity',//入库初始值
        'company_goods_sku.frequency',//发货频率
        'lowest_price',//最低价
        'in_price',//进价
        'company_goods_sku_type',
        'pre_price',
        'deliveryTemplateId'
    ];
    var sqlCondition = 'where company_goods.company_goods_id = '+data.company_goods_id;
    var sqlSelect = 'select '+fields.join(',')+' ';
    var sqlFrom = 'from company_goods ';
    var sqlJoin = 'left join company_goods_status on company_goods_status.company_goods_status_id=company_goods.company_goods_status_id ';
    sqlJoin +='left join company_goods_sku on company_goods_sku.company_goods_id=company_goods.company_goods_id '
    // 拼接字符串
    sql += sqlSelect+sqlFrom+sqlJoin+sqlCondition;
   console.log(sql);
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        console.log(data);

        var sku=[];
        data.forEach(function(item){
            if(item.status!=0){
                item.company_goods_price=item.company_goods_price/1000;
                item.lowest_price= item.lowest_price/1000
                item.in_price= item.in_price/1000
                item.pre_price=item.pre_price/1000;
                item.company_goods_sale_price=item.company_goods_sale_price/1000;
                sku.push({company_goods_sku_id:item.company_goods_sku_id,company_goods_norms:item.company_goods_norms,
                    company_goods_price:item.company_goods_price,company_goods_left_quantity:item.company_goods_left_quantity,status:1,company_goods_sale_price:item.company_goods_sale_price,
                    company_goods_sale_quantity:item.company_goods_sale_quantity,init_quantity:item.init_quantity,frequency:item.frequency,lowest_price:item.lowest_price,in_price:item.in_price,company_goods_sku_type:item.company_goods_sku_type,pre_price: item.pre_price,deliveryTemplateId:item.deliveryTemplateId})
            }

        })
        var goodDetail={};

        goodDetail.company_goods_category_id=data[0].company_goods_category_id.split(",")[1];
        goodDetail.company_goods_category_id=parseInt(goodDetail.company_goods_category_id);
        goodDetail.company_goods_id=data[0].company_goods_id;
        goodDetail.company_goods_name=data[0].company_goods_name;
        goodDetail.company_goods_desc=data[0].company_goods_desc;
        goodDetail.company_goods_icon=data[0].company_goods_icon;
        goodDetail.auditResult=data[0].auditResult;
        goodDetail.areas_name=data[0].areas_name;
        goodDetail.areas_id=data[0].areas_id;
        goodDetail.company_goods_detail_img=data[0].company_goods_detail_img;
        goodDetail.company_goods_details=data[0].company_goods_details;
        goodDetail.repertory_place=data[0].repertory_place;
        goodDetail.company_goods_place=data[0].company_goods_place;
        goodDetail.company_goods_status_id=data[0].company_goods_status_id;
        goodDetail.company_goods_status_name=data[0].company_goods_status_name;
        goodDetail.company_goods_send=data[0].company_goods_send;
        goodDetail.company_goods_repeat_send=data[0].company_goods_repeat_send;
        goodDetail.temperature=data[0].temperature;
        goodDetail.save_days=data[0].save_days;
        goodDetail.sales_type=data[0].sales_type;
        goodDetail.pre_delivery_time=moment(data[0].pre_delivery_time).format('YYYY-MM-DD')
        goodDetail.sku=sku;
        return cb&&cb(null,goodDetail);
    })
}

/**
 * @desc 添加商品
 * @param {func} cb 回调函数
 */

goodsDao.addGoods=function(data,cb){
    console.log(data);

    var nowTime=moment().format("YYYY-MM-DD HH:mm:ss");
    var sql = '';
    var fields = [
        'company_goods_send',  //商品是否支持快递
        'company_goods_repeat_send',//商品是否支持转发
        'company_goods_name', // 商品名称
        'company_goods_desc', //商品简介
        'company_goods_icon', // 商品图标
        'company_goods_detail_img',//商品详情页图片
        'company_goods_details', // 商品详情页描述

        'company_goods_place', // 商品原产地
        'company_goods_category_id',//商品分类的id
        'add_date',//新增时间

        'company_goods_status_id',//商品的状态id
        'company_id',//供应商id
        'temperature',//保存温度
        'save_days',//保存时间
        'sales_type',//销售类型
        'pre_delivery_time',//预售发货时间
//HEAD
        'repertory_place',//仓库所在地
        'company_goods_fresh',
//
        'areas_name',
        'areas_id'
//yunfei
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
        //'now()',
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

    var sqlInsert = 'insert into company_goods ('+fields.join(',')+') values ('+values.join(',') +')' ;
    // 拼接字符串
    sql += sqlInsert;
    console.log(sql);

    data.company_goods_category_id=','+data.company_goods_category_id+',';
    // 插入并返回结果
    sqlClient.query(sql,[data.company_goods_send,data.company_goods_repeat_send,data.company_goods_name,data.company_goods_desc, data.company_goods_icon,data.company_goods_detail_img,data.company_goods_details,
//HEAD
    data.company_goods_place,data.company_goods_category_id,nowTime,data.company_goods_status_id,data.company_id,data.temperature,data.save_days,data.sales_type,data.pre_delivery_time,data.repertory_place,1,data.areas_name,data.areas_id],function(err, rows){
//
    //data.company_goods_place,data.company_goods_category_id,data.company_goods_status_id,data.company_id,data.temperature,data.save_days,data.sales_type,data.pre_delivery_time,data.areas_name,data.areas_id],function(err, rows){
// yunfei
        if(err){
            return  cb&&cb(err, null);
        }
        if(data.company_goods_status_id==1){
            commonDao.sendEmail('xuling@dayday7.com','商家有新提交的商品','<b>商家有新提交的商品</b>','新商品提交审核');
        }
        console.log(rows);
        insertGoodsSku({norms:data.sku,company_goods_id:rows.insertId},function(err,data){
            if(err){
                cb&&cb(err, null);
            }else{
                return cb&&cb(null, {company_goods_id:rows.insertId});
            }
        })
    })
}

//插入商品的sku
function insertGoodsSku(data,cb){
    console.log(data);
    console.log('wwwwwwwwwwwww')
    var fields = [
        'company_goods_norms', //
        'company_goods_price', // 现价
        'company_goods_sale_price',//原价
        'add_date',//添加时间
        'company_goods_left_quantity',
        'company_goods_id',
        'init_quantity',
        'frequency',
        'lowest_price',//最低价
        'in_price',//进价
        'pre_price',//预售价
        'deliveryTemplateId'
    ];
    var values=[];

    data.norms.forEach(function(item){
        item.company_goods_price=parseInt(item.company_goods_price*1000);
        item.lowest_price=parseInt(item.lowest_price*1000);
        item.in_price=parseInt(item.in_price*1000);
        item.pre_price=parseInt(item.pre_price*1000);
        values.push('("'+item.company_goods_norms+'",'+item.company_goods_price+','+item.company_goods_price+','+'now()'+',' +
        ''+item.company_goods_left_quantity+','+data.company_goods_id+','+item.init_quantity+','+item.frequency+','+item.lowest_price+','+item.in_price+','+item.pre_price+','+item.deliveryTemplateId+')');
    })

    var sqlInsert = 'insert into company_goods_sku ('+fields.join(',')+') values'+values.join(',') ;
    console.log(sqlInsert);
    sqlClient.query(sqlInsert,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        console.log(data);
        return cb&&cb(null, data);
    })
}

/**
 * @desc 修改商品
 * @param {func} cb 回调函数
 */

goodsDao.updateGoods=function(data,cb){
    console.log('ddw')
    console.log(data);
    var sql = '';
    var fields = [
        'company_goods_send = ?',
        'company_goods_repeat_send = ?',
        'company_goods_name = ?', // 配送点状态名称
        'company_goods_desc = ?',
        'company_goods_icon = ?', // 修改时间
        'company_goods_detail_img = ?',
        'company_goods_details = ?',
        'company_goods_place = ?',
        'company_goods_category_id = ?',
        'temperature = ? ',
        'save_days = ? ',
        'company_goods_status_id = ?',
        'sales_type=?',//销售类型
        'pre_delivery_time=?',//预售发货时间
//HEAD
        'repertory_place=?',
//
        'areas_name=?',
        'areas_id=?'
// yunfei
    ];
    var sqlCondition = 'where company_goods_id='+data.company_goods_id;
    var sqlupdate = 'update company_goods set '+fields.join(',')+' ';

    // 拼接字符串
    sql += sqlupdate+sqlCondition;
    data.company_goods_category_id=','+data.company_goods_category_id+',';
    // 更新并返回结果
    console.log(sql);
    sqlClient.query(sql,[data.company_goods_send,data.company_goods_repeat_send,data.company_goods_name,data.company_goods_desc,data.company_goods_icon,data.company_goods_detail_img,data.company_goods_details,
//HEAD
        data.company_goods_place,data.company_goods_category_id,data.temperature,data.save_days,data.company_goods_status_id,data.sales_type,data.pre_delivery_time,data.repertory_place,data.areas_name,data.areas_id],function(err, res){
//
        //data.company_goods_place,data.company_goods_category_id,data.temperature,data.save_days,data.company_goods_status_id,data.sales_type,data.pre_delivery_time,data.areas_name,data.areas_id],function(err, res){
//yunfei
        if(err){
            return  cb&&cb(err, null);
        }
        if(data.company_goods_status_id==1){
            commonDao.sendEmail('xuling@dayday7.com','商家有新提交的商品','<b>商家有新提交的商品</b>','新商品提交审核');
        }
        for(var i=0;i< data.sku.length;i++){
            data.sku[i].company_goods_id=data.company_goods_id;
        }

        updateSku({norms:data.sku},function(err,data){
            if(err){
                return  cb&&cb(err, null);
            }else{
                console.log(data);
                return cb&&cb(null, {result:200});
            }
        })

    })
}

//修改商品的sku
function updateSku(data,cb){
    console.log('sssssssssssss')
console.log(data)
    var values=[];
    data.norms.forEach(function(item){
        item.company_goods_sale_price=parseInt(item.company_goods_price*1000);
        item.company_goods_price=parseInt(item.company_goods_price*1000);
        item.lowest_price=parseInt(item.lowest_price*1000);
        item.in_price=parseInt(item.in_price*1000);
        item.pre_price=parseInt(item.pre_price*1000);
        if(!item.company_goods_sku_id){
            item.company_goods_sku_id=null;
        }
//HEAD
        values.push('('+item.company_goods_sku_id+',"'+item.company_goods_norms+'",'+item.company_goods_price+','+item.company_goods_sale_price+','+item.company_goods_left_quantity+','
        +item.company_goods_id+','+item.status+','+'now()'+','+item.init_quantity+','+item.frequency+','+item.lowest_price+','+item.in_price+','+item.pre_price+','+item.deliveryTemplateId+')');
//
/*
        values.push('('+item.company_goods_sku_id+',"'+item.company_goods_norms+'",'+item.company_goods_price+','+item.company_goods_price+','+item.company_goods_left_quantity+','
        +item.company_goods_id+','+item.status+','+'now()'+','+item.init_quantity+','+item.frequency+','+item.lowest_price+','+item.in_price+','+item.pre_price+','+item.deliveryTemplateId+')');
*/
//yunfei
    })

        var sql = '';
        var fields = [
            'company_goods_sku_id',
            'company_goods_norms',
            'company_goods_price',
            'company_goods_sale_price',
            'company_goods_left_quantity',
            'company_goods_id',
            'status',
            'add_date',
            'init_quantity',
            'frequency',
            'lowest_price',//最低价
            'in_price',//进价
            'pre_price',
            'deliveryTemplateId'
        ];

        var sqlupdate = 'insert into company_goods_sku '+'('+fields.join(',')+')'+ ' values '+values.join(',') +'ON DUPLICATE KEY UPDATE company_goods_norms=values(company_goods_norms),company_goods_price=values(company_goods_price),company_goods_sale_price=values(company_goods_sale_price),company_goods_left_quantity=values(company_goods_left_quantity),status=values(status),init_quantity=values(init_quantity),frequency=values(frequency),lowest_price=values(lowest_price),in_price=values(in_price),pre_price=values(pre_price),deliveryTemplateId=values(deliveryTemplateId)';

        // 拼接字符串
        sql += sqlupdate;
        // 更新并返回结果
        console.log(sql);
        sqlClient.query(sql,null,function(err, data){
            if(err){
                return  cb&&cb(err, null);
            }
            console.log(data);
           return cb&&cb(null, data);
        })
}

goodsDao.updateGoodsSku=function(data,cb){
    updateSku({norms:data},function(err,res){
        if(err){
            return  cb&&cb(err, null);
        }else{
            console.log(res);
            return cb&&cb(null, {result:200});
        }
    })
}

//修改商品状态

goodsDao.updateGoodsStatue=function(data,cb){
    var sql = '';
    var fields = [
        'statue = '+data.statue, // 配送点状态名称
        'company_goods_status_id ='+data.company_goods_status_id,
        'billing_type=0'
    ];
    var sqlCondition = 'where company_goods_id='+data.company_goods_id;
    var sqlupdate = 'update company_goods set '+fields.join(',')+' ';

    // 拼接字符串
    sql += sqlupdate+sqlCondition;
    // 更新并返回结果
    sqlClient.query(sql,null,function(err, data){
        if(err){
            cb&&cb(err, null);
        }
        return cb&&cb(null, {result:200});
    })
}



//买一送一和暂停活动

goodsDao.updateGoodsStatueForOneByOne=function(data,cb){
        var sql = '';
    var fields=[];
    var sqlCondition='';
    console.log(data)
    console.log('ssswwe')
    if(data.selfActivity==1) {//自营活动暂停
        console.log(data);
        console.log('dewdw')
        if(data.audit==2 || data.audit==3){//判断商品是否还是大会场商品
            fields = [
                // 配送点状态名称
                'company_goods_sku.gift_sku_number=0',
                'company_goods_sku.gift_sku_id=0',
                'company_goods_sku.company_goods_price=company_goods_sku.company_goods_sale_price',
                'company_goods_sku.discount_rate=0',
                /* 'company_goods_sku.company_goods_sale_startdate='+moment().format('YYYY-MM-DD HH:mm:ss'),
                 'company_goods_sku.company_goods_sale_enddate='+moment().format('YYYY-MM-DD HH:mm:ss')*/
                'company_goods_sku_type=0',
                'company_goods_sku_audit=0',
                'company_goods_self_activity=2',//暂停活动后的商品状态
                'company_goods_sku_buy_number=0',
                'company_goods_sku_activity_id=0'
            ];
        }
       else{
            fields = [
                // 配送点状态名称
                'company_goods_sku.gift_sku_number=0',
                'company_goods_sku.gift_sku_id=0',
                'company_goods_sku.company_goods_price=company_goods_sku.company_goods_sale_price',
                'company_goods_sku.discount_rate=0',
                /* 'company_goods_sku.company_goods_sale_startdate='+moment().format('YYYY-MM-DD HH:mm:ss'),
                 'company_goods_sku.company_goods_sale_enddate='+moment().format('YYYY-MM-DD HH:mm:ss')*/
                'company_goods_sku_type=0',
                'company_goods_sku_audit=0',
                'company_goods_audit=0',
                'company_goods_self_activity=2',//暂停活动后的商品状态
                'company_goods_sku_buy_number=0',
                'company_goods_sku_activity_id=0'
            ];
        }
        sqlCondition = 'where company_goods.company_goods_id='+data.company_goods_id +' and company_goods_sku.company_goods_id='+data.company_goods_id+' and company_goods_sku.company_goods_sku_id='+data.company_goods_sku_id;

    }
    else if(data.selfActivity==2){//审核暂停活动
        fields = [
            // 配送点状态名称
            'company_goods_sku.gift_sku_save_number=0',
            'company_goods_sku.gift_sku_save_id=0',
            'company_goods_sku.company_goods_price=company_goods_sku.company_goods_sale_price',
            'company_goods_sku.discount_save_rate=0',
            'company_goods_sku_type=0',
            'company_goods_sku_audit=0',
            'company_goods_audit=0',
            'company_goods_sku_buy_number=0',
            'company_goods_sku_activity_id=0'
        ];
        sqlCondition = 'where company_goods.company_goods_id='+data.company_goods_id +' and company_goods_sku.company_goods_id='+data.company_goods_id+' and company_goods_sku.company_goods_sku_id='+data.company_goods_sku_id;
console.log('jhehe')
    }
    else {
        if(data.activity_type==0){
                fields = [
                    'company_goods_self_activity=1',
                    'company_goods_sku_audit=1',//不参加会场
                    'company_goods_sku_type=3',//买一送一
                    'company_goods_sku_activity_id=0',//测试双十一
                    'company_goods_sku.gift_sku_number='+data.gift_number,
                    'company_goods_sku.gift_sku_id='+data.gift_sku_id,
                    'company_goods_sku_buy_number='+data.limit_buy_number
                ];
        }
       else{
                fields = [
                    'company_goods_sku_audit=2',//审核
                    'company_goods_audit=2',
                    'company_goods_sku_type=3',//买一送一
                    'company_goods_sku_activity_id='+data.activity_type,//测试双十一
                    'company_goods_sku.gift_sku_save_number='+data.gift_number,
                    'company_goods_sku.gift_sku_save_id='+data.gift_sku_id,
                    'company_goods_sku_buy_number='+data.limit_buy_number
                ];
        }
        sqlCondition = 'where company_goods.company_goods_id='+data.company_goods_id +' and company_goods_sku.company_goods_id='+data.company_goods_id+' and company_goods_sku.company_goods_sku_id='+data.company_goods_sku_id;

    }

        var sqlupdate = 'update company_goods,company_goods_sku set '+fields.join(',')+' ';

        // 拼接字符串
        sql += sqlupdate+sqlCondition;
        // 更新并返回结果
    console.log(sql);
    console.log("我I我I我I");
        sqlClient.query(sql,null,function(err, data){
            if(err){
                cb&&cb(err, null);
            }
           return cb&&cb(null, {result:200});
        })
}

goodsDao.getGoodsStatue=function(data,cb) {
    var sql = '';
    var fields = [
        'company_goods_status_id',  //商品状态id
        'company_goods_status_name' //商品状态名称
    ];
    var sqlCondition = 'where status= 1 ';
    var sqlselect = 'select  ' + fields.join(',') + ' from company_goods_status ';

    // 拼接字符串
    sql += sqlselect + sqlCondition;
    // 更新并返回结果
    console.log(sql);
    sqlClient.query(sql, null, function (err, data) {
        if (err) {
            cb && cb(err, null);
        }
        return cb && cb(null, {result: data});
    })
}
goodsDao.getGoodsByCompanyGoodsStatue=function(data,cb) {
        var sql = '';
        var fields = [
            'company_goods_name',
            'company_goods_id'
        ];

        var sqlCondition = 'where statue= 1 and company_id='+data.company_id;
        var sqlselect = 'select  ' + fields.join(',') + ' from company_goods ';
        // 拼接字符串
        sql += sqlselect + sqlCondition;
        // 更新并返回结果
        console.log(sql);
        sqlClient.query(sql, null, function (err, data) {
            if (err) {
                cb && cb(err, null);
            }
            return cb && cb(null, {result: data});
        })
    }
goodsDao.getGoodsByCompanyGoodsSkuStatue=function(data,cb) {
    var sql = '';
    var fields = [
        'company_goods_norms',
        'company_goods_sku_id',
        'company_goods_sale_price'
    ];

    var sqlCondition = 'where status= 1 and company_goods_id='+data.company_goods_id;
    var sqlselect = 'select  ' + fields.join(',') + ' from company_goods_sku ';
    // 拼接字符串
    sql += sqlselect + sqlCondition;
    // 更新并返回结果
    console.log(sql);
    sqlClient.query(sql, null, function (err, data) {
        if (err) {
            cb && cb(err, null);
        }
        return cb && cb(null, {result: data});
    })
}
goodsDao.updateGoodsAndGoodsSku=function(data,cb){
    var sql = '';
    var fields = [
        'company_goods_sku.gift_sku_number=0',
        'company_goods_sku.gift_sku_id=0',
        'company_goods.sales_promotion=0'
    ];
    var sqlCondition = 'where company_goods.company_goods_id='+data.company_goods_id +' and company_goods_sku.company_goods_id='+data.company_goods_id;
    var sqlupdate = 'update company_goods,company_goods_sku set '+fields.join(',')+' ';

    // 拼接字符串
    sql += sqlupdate+sqlCondition;
    // 更新并返回结果
    console.log(sql);
    sqlClient.query(sql,null,function(err, data){
        if(err){
            cb&&cb(err, null);
        }
        return cb&&cb(null, {result:200});
    })
}
//促销商品和打折
goodsDao.updateSkuAndGoods=function(data,cb){
    var sql = '';
    var fields=[];
    if(data.activity_type==0){

        if(data.company_goods_sku_type==1)
        {
                fields = [
                    'company_goods_self_activity=1',
                    'company_goods_sku_audit=1',//不参加会场
                    'company_goods_sku_type=1',//打折
                    'company_goods_sku_activity_id=0',//测试双十一
                    'company_goods_sku.discount_rate='+(data.discount_rate*1000),
                    'company_goods_sku.company_goods_price='+(data.discount_rate*1000*data.company_goods_sale_price),
                    'company_goods_sku_buy_number='+data.limit_buy_number,

                ];
        }
        console.log('hehe2');
        if(data.company_goods_sku_type==2)
        {
                fields = [
                    'company_goods_self_activity=1',
                    'company_goods_sku_audit=1',//不参加会场
                    'company_goods_sku_type=2',//特惠
                    'company_goods_sku_activity_id=0',//测试双十一
                    'company_goods_sku.company_goods_price='+(data.company_goods_price*1000),
                    'company_goods_sku_buy_number='+data.limit_buy_number,
                ];
        }
    }
    else{
        if(data.company_goods_sku_type==1)
        {
            fields = [
                    'company_goods_audit=2',//用作主界面加载商品时判断的参数
                    'company_goods_sku_type=1',//打折
                    'company_goods_sku_audit=2',//待审核
                    'company_goods_sku_activity_id='+data.activity_type,//测试双十一
                    'company_goods_sku.discount_save_rate='+(data.discount_rate*1000),
                    'company_goods_sku_buy_number='+data.limit_buy_number,
                    'company_goods_sku_save_price='+(data.discount_rate*1000*data.company_goods_sale_price),

                ];
                console.log('dfewg')
        }
        console.log('hehe2');
        if(data.company_goods_sku_type==2)
        {
            fields = [
                    'company_goods_audit=2',
                    'company_goods_sku_type=2',//特惠
                    'company_goods_sku_audit=2',//待审核
                    'company_goods_sku_activity_id='+data.activity_type,//测试双十一
                    'company_goods_sku_buy_number='+data.limit_buy_number,
                    'company_goods_sku_save_price='+(data.company_goods_price*1000),
                ];
        }
    }

    var sqlCondition = 'where company_goods_sku.company_goods_sku_id='+data.company_goods_sku_id +' and company_goods_sku.company_goods_id=company_goods.company_goods_id';
    var sqlupdate = 'update company_goods,company_goods_sku set '+fields.join(',')+' ';

    // 拼接字符串
    sql += sqlupdate+sqlCondition;
    // 更新并返回结果
    console.log(sql);
    console.log('hehe');
    sqlClient.query(sql,null,function(err, data){
        if(err){
            cb&&cb(err, null);
        }
        return cb&&cb(null, {result:200});
    })
}
goodsDao.getActivity = function (data,cb) {
    console.log("ssssssssss"+data)
    var sql = '';
    var fields = [
     'activity_id',
        'activity_name',
        'activity_start_time',
        'activity_end_time',
        'activity_describe',
        'activity_type'
    ];
    if(data==0){
        var sqlCondition = ' where activity_status=1 and status=1 and activity_type=0 order by activity_start_time desc ';
    }
   if(data==1){
       var sqlCondition = ' where activity_status=1 and status=1 order by activity_start_time desc';
   }
    var sqlselect= 'select '+fields.join(',')+'  from activity';
    // 拼接字符串
    sql += sqlselect+sqlCondition;
    // 更新并返回结果
    console.log(sql);
    sqlClient.query(sql,null,function(err, data){
        if(err){
            cb&&cb(err, null);
        }
        return cb&&cb(null, {result:data});
    })
}
goodsDao.updateGoodsActivityIcon=function(data,cb){
        console.log('iyu ')
    console.log(data);
    var sql = '';
    var fields = [

        'company_goods_activity_icon ="'+data.company_goods_activity_icon+'"', // 修改时间
    ];
    var sqlCondition = 'where company_goods_id='+data.company_goods_id;
    var sqlupdate = 'update company_goods set '+fields.join(',')+' ';

    // 拼接字符串
    sql += sqlupdate+sqlCondition;
    data.company_goods_category_id=','+data.company_goods_category_id+',';
    // 更新并返回结果
    console.log(sql);
    sqlClient.query(sql,null,function(err, res){
        if(err){
            return  cb&&cb(err, null);
        }
        return cb&&cb(null, {result:res});
    })
}
var getSalesQualityByDay =function(company_id,company_goods_sku_id,cb){
    var sql=''
    var selectSql='select sum(order_items.product_quantity) as total from orders'
    var joinSql=' left JOIN order_items on order_items.order_id=orders.order_id '
    joinSql+=' LEFT JOIN company_goods_sku on order_items.prod_sku_id=company_goods_sku.company_goods_sku_id'
    joinSql+=' LEFT JOIN company_goods on company_goods.company_goods_id=company_goods_sku.company_goods_id'
    joinSql+=' LEFT JOIN company on  company.company_id=company_goods.company_id'
    var condition=' where orders.date_purchased>= "'+moment().subtract(1, 'days').format('YYYY-MM-DD')+'"'+' and orders.date_purchased< "'+moment().format("YYYY-MM-DD")+'" and orders.order_status_id in(5,11) and company.company_id='+company_id +' and company_goods_sku.company_goods_sku_id='+company_goods_sku_id
    sql=selectSql+joinSql+condition;
    console.log(sql)
    sqlClient.query(sql,null,function(err,data){
        if(err){
            return  cb&&cb(err, null);
        }
        console.log(data);
        return cb&&cb(null, data);
    });
}

goodsDao.getGoodsShareInfo = function (data,cb){
    var sql = '';
    var fields = [
        'company_goods.company_goods_id',//商品id
        'company_goods_name',//商品名称
        'company_goods_icon',//商品图标
        'company_goods_desc'//商品简介
    ];
    var sqlCondition = 'where company_goods.company_goods_id = '+data.company_goods_id;
    var sqlSelect = 'select '+fields.join(',')+' ';
    var sqlFrom = 'from company_goods ';
    // 拼接字符串
    sql += sqlSelect+sqlFrom+sqlCondition;
    console.log(sql);
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        console.log(data);
        var shareDetail={};

        shareDetail.title=data[0].company_goods_name;
        shareDetail.summary=data[0].company_goods_desc;
        shareDetail.img=data[0].company_goods_icon;
        shareDetail.url='http://www.dayday7.com';

        return cb&&cb(null,shareDetail);
    })
}