/**
 * Created by wei on 16/1/25.
 */
var router = require("express").Router();
var uploadDao = require('./uploadModel');
var logger = require('../index').logger('index');
var moment = require('moment');//moment库是一个时间处理的库

function uploadImg(req,res){
    uploadDao.upload(function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}


router.post("/img",uploadImg);

module.exports = router;