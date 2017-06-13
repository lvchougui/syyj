/**
 * Created by wei on 16/1/25.
 */
var router = require("express").Router();
var accountDao = require('./accountModel');
var logger = require('../index').logger('index');
var nodeExcel=require("excel-export");
var moment = require('moment');//moment库是一个时间处理的库
var SDK=require('../common/SDK');

function getConfig(req,res){
    accountDao.getConfig(function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function updateConfig(req,res){
    logger.info(req.body);
    accountDao.updateConfig(req.body,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}


router.get("/getConfig",getConfig);
router.post("/chgConfig",updateConfig);

module.exports = router;