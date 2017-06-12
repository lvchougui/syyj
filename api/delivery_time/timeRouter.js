var router = require("express").Router();
var timeDao = require('./timeModel');
var logger = require('../index').logger('index');


function getTimeList(req, res){
    logger.info({company_id:req.params.company_id});
    timeDao.getTimeList(req.params.company_id, function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function addDeliveryTime(req, res){
    logger.info(req.body);
    timeDao.addDeliveryTime(req.body, function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function delDeliveryTime(req,res){
    logger.info({delivery_time_id:req.params.delivery_time_id});
    timeDao.delDeliveryTime(req.params.delivery_time_id,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

router.get("/getTimeList/:company_id",getTimeList);//获取商户的配送时间列表
router.post("/addDeliveryTime",addDeliveryTime);//新增商户的配送时间列表
router.put("/delDeliveryTime/:delivery_time_id",delDeliveryTime);//删除商户的配送时间列表

module.exports = router;