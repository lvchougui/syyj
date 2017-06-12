/**
 * Created by wei on 16/1/25.
 */
var router = require("express").Router();
var accountDao = require('./accountModel');
var logger = require('../index').logger('index');
var nodeExcel=require("excel-export");
var moment = require('moment');//moment库是一个时间处理的库
var SDK=require('../common/SDK');

var expressCode=[
    {
        "com":"顺丰",
        "kdnno":"SF",
        "jhno":"sf",
        "yz":"7"
    },
    {
        "com":"申通",
        "kdnno":"STO",
        "jhno":"sto",
        "yz":"1"
    },
    {
        "com":"圆通",
        "kdnno":"YTO",
        "jhno":"yt",
        "yz":"2"
    },
    {
        "com":"韵达",
        "kdnno":"YD",
        "jhno":"yd",
        "yz":"4"
    },
    {
        "com":"天天",
        "kdnno":"HHTT",
        "jhno":"tt",
        "yz":"5"
    },
    {
        "com":"EMS",
        "kdnno":"EMS",
        "jhno":"ems",
        "yz":"11"
    },
    {
        "com":"中通",
        "kdnno":"ZTO",
        "jhno":"zto",
        "yz":"3"
    },
    {
        "com":"汇通",
        "kdnno":"HTKY",
        "jhno":"ht",
        "yz":"6"
    }
];


function getDeliverNo(req,res){
    accountDao.getDeliverNo(function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
//修改帐号信息
function chgAccount(req,res){
    logger.info(req.body);
    accountDao.chgAccount(req.body,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}

//获取供应商账号信息
function getAccount(req,res){
    var data={
        company_id:req.params.company_id
    }
    logger.info(data);
    accountDao.getAccount(data,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}

//登录
function login(req,res){
    logger.info(req.body);
    accountDao.login(req.body,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}

//供应商提现明细
function getWithdrawDetail(req,res){
    var data={
        company_id:req.params.company_id,
        page:req.params.page,
        size:req.params.size
    }
    logger.info(data);
    accountDao.getWithdrawDetail(data,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}

//供应商获取发货单列表
function getOrders(req,res){
    logger.info(req.body);
    accountDao.getOrders(req.body,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });

}



//供应商修改发货单状态
function chgOrderStatue(req,res){
    console.log(expressCode);
    logger.info(req.body);
    console.log("req.body==");
    console.log(req.body);
    var form=req.body;

    console.log(form);

    expressCode.forEach(function(item){
        if(item.yz==form.express_company_id){
           form.express_company_code=item.kdnno;
        }
    })

    accountDao.updateChildOrders(form);

    accountDao.chgOrderStatue(form,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        if(req.body.order_no.length==28&&req.body.fresh==1){
            var sdk = SDK({key:'2da5f40eac3078be47', secret:'56f650f638e2ce37554d5c25ed2023ab'});
            console.log('需要对接有赞');
            accountDao.getOids(req.body.company_orders_id,function(err,data){
                var mark=0;
                var temp='';
                data.forEach(function(item){
                    if(mark==0){
                        temp=temp+item.oid;
                    }else{
                        temp=temp+','+item.oid;
                    }
                    mark++;
                })

                sdk.post('kdt.logistics.online.confirm',{
                    outer_tid:req.body.order_no,
                    oids:temp,
                    out_stype:req.body.express_company_id,
                    out_sid:req.body.express_no


                }).then(function(data){
                    console.log("卖家发货了");
                    console.log(data);

                });

            })

        }else{
            console.log('不需要对接有赞');
        }

        return res.json(200, data);
    });
}

//获取发货单所有状态
function getOrderStatue(req,res){
    accountDao.getOrderStatue(null,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function updateRemindInformation(req,res){
    accountDao.updateRemindInformation(req.body,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    })
}
function selectRemindInformation(req,res){
    data={
        company_id:req.params.company_id
    }
    accountDao.selectRemindInformation(data,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    })
}
function exportExcel(req, res){
    // 根据条件读取所有表格数据
    var orderName=["全部","待发货","已发货","已收货"];
    var query = req.query;
    // 组装条件对象
    var condition = {company_id:null,company_orders_status_id:null};
    if(!!query.company_id) condition.company_id = query.company_id;
    if(!!query.company_orders_status_id) condition.company_orders_status_id = query.company_orders_status_id;
    // 分页参数的处理
    var page = 1;
    var size = 10;
    if(query.page) page = query.page;
    if(query.size) size = query.size;

    // return res.json(200,{result: condition});

    // 请求数据查询
    accountDao.findByCondition(condition, page, size, function(err,data){
        if (!!err) {
            console.log(err);
            return res.json(500, {error: err});
        }
        console.log(data);
        console.log('iiiiiiiii');
        // 将数据转化为表格形式
        var conf = convertToTable(data.result);
        console.log(conf)
        // 生成excel文件
        var excelBinary = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'applicationnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + moment(Date.now()).format("YYYY-YY-DD HH:mm:ss")+".xlsx");
        return res.end(excelBinary, 'binary');

        // return res.json(200,{results: conf});
    })
}
function convertToTable(orders){
    var conf = {
        cols:[],
        rows:[]
    }
    // 订单字段映射
    var map = {
        'company_orders_id':'订单ID',
        'order_no':'订单编号', // 编号
        'receiver_name':'收货人姓名', // 收货人姓名
        'deliver_phone':'收货人电话', // 收货人电话
        'deliver_address':'收货地址', // 收货地址
        'deadline_time':'发货截止时间', // 订单状态
        'goods':'商品列表', // 付款方式
        'site_name':'发货单属性'  // 下单时间
    }
    // 遍历生成表格数据
    // 生成表格头部
    for(var key in map){
        var value = map[key];
        conf.cols.push({
            caption:value,
            type:'string',
            width:30
        })
    }
    // 生成表格元素
    orders.forEach(function(order,index,a){
        var row = []
        for(var key in map){

            if(key=='goods'){
                var goods=order[key]
                var goodMap = {
                    'company_goods_name':'商品名称', // 编号
                    'company_goods_norms':'规格', // 收货人姓名
                    'company_orders_goods_quantity':'数量', // 收货人电话
                }
                //添加列元素
                console.log('ada')
                var goodInformation='';
                goods.forEach(function (item) {
                    console.log(item)
                    console.log('asdaaa')
                    goodInformation+='商品名称:'+item.company_goods_name+"  规格:"+item.company_goods_norms+"  数量:"+item.company_orders_goods_quantity+"\n"+"\r"
                })
                row.push(goodInformation);
            }
            else
            {
                if(key=='site_name'){
                    if(!order[key]){
                        row.push('快递单');
                    }
                    else{
                        row.push('配送单(送往配送点)');
                    }
                }
                else{
                    row.push(order[key]);
                }

            }

        }
        conf.rows.push(row);
    })
    return conf;
}
function getStore(req,res){
    var data={
        company_id:req.params.company_id
    }
    accountDao.getStore(data,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    })
}

function getShippingTemplate(req,res){

    accountDao.getShippingTemplate(req.params.company_id,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    })
}

function getAllShippingTemplate(req,res){

    accountDao.getAllShippingTemplate(req.params.company_id,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    })
}


function addStore(req,res){
    accountDao.addStore(req.body,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    })
}
function updateStore(req,res){
    console.log(req.body);

    accountDao.updateStore(req.body,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        accountDao.updateCompany(req.body.shippingTemplate_id,req.body.company_id,function(err,data){
            if(err){
                console.log(err);
                return res.json(500,err);
            }
            return res.json(200, true);
        });


    })
}
function getExcel(req,res){
    console.log('gggg')
    console.log(req)

    accountDao.getExcel(req.files.file,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    })
}
router.get("/getAccount/:company_id",getAccount);//修改供应商账户信息
router.post("/chgAccount",chgAccount);//修改供应商账户信息
router.post("/login",login);//供应商登录
router.get("/getWithdrawDetail/:company_id/:page/:size",getWithdrawDetail);//供应商提现明细

router.post("/getOrders",getOrders);//获取供应商发货单
router.post("/chgOrderStatue",chgOrderStatue);//修改发货单状态
router.get("/getOrderStatue",getOrderStatue);//获取发货单所有状态
router.post("/updateRemindInformation",updateRemindInformation);
router.get("/selectRemindInformation/:company_id",selectRemindInformation);
router.get("/exportExcel",exportExcel);
router.get("/getStore/:company_id",getStore);//修改供应商账户信息
router.get("/getShippingTemplate/:company_id",getShippingTemplate);
router.get("/getAllShippingTemplate/:company_id",getAllShippingTemplate);

router.post("/addStore",addStore);
router.post("/updateStore",updateStore);
router.get("/getDeliverNo",getDeliverNo);
router.post("/getExcel",getExcel);
module.exports = router;