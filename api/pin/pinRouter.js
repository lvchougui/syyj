var router = require("express").Router();
var pinDao = require('./pinModel');
var goodsDao = require('../goods/goodsModel');
var logger = require('../index').logger('index');

function getPinActivity(req, res){
    logger.info(req.body);
    pinDao.getPinActivity(req.body, function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function getPinActivityDetail (req,res){
    var data={
        id:req.params.activity_id
    }
    logger.info(data);
    pinDao.getPinActivityDetail(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        var postData={
            company_goods_id:data.product_id
        }
        goodsDao.getGoodsByCompanyGoodsSkuStatue(postData,function(err,returnData){
            if(err){
                return res.json(500,err);
            }
            logger.info(data);
            data.sku_norms = returnData.result;
            return res.json(200, data);
        });
        //logger.info(data);
        //return res.json(200, data);
    });
}

function addPinActivity(req, res){
    logger.info(req.body);
    pinDao.addPinActivity(req.body, function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function delPinActivity(req,res){
    logger.info({activity_id:req.params.activity_id});
    pinDao.delPinActivity(req.params.activity_id,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data} );
    })
}

function updatePinActivity(req,res){
    logger.info(req.body);
    pinDao.updatePinActivity(req.body,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}

function remPinActivity(req,res){
    logger.info({activity_id:req.params.activity_id});
    pinDao.remPinActivity(req.params.activity_id,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200,{results:data});
    })
}

router.post("/getPinActivity",getPinActivity);//获取活动
router.get("/getPinActivityDetail/:activity_id", getPinActivityDetail); //获取活动详情
router.post("/addPinActivity",addPinActivity);//新增活动
router.post("/updatePinActivity",updatePinActivity);//修改活动
router.put("/delPinActivity/:activity_id",delPinActivity);//删除活动
router.put("/remPinActivity/:activity_id",remPinActivity);//下架活动


module.exports = router;