/**
 * Created by wei on 16/1/25.
 */
var router = require("express").Router();
var chargeDao = require('../delivery_charge/chargeModel');
var logger = require('../index').logger('index');
var moment = require('moment');//moment库是一个时间处理的库

function isDeliveryTemplateNmaeExsit(req,res){

    chargeDao.isDeliveryTemplateNmaeExsit(req.body,function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function getDeliveryTemplates(req,res){
    var data={
        page:req.params.page,
        pageSize:req.params.pageSize,
        company_id:req.params.company_id
    }
    chargeDao.getDeliveryTemplates(data,function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}

function addDeliveryTemplate(req,res){
    chargeDao.addDeliveryTemplate(req.body, function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function addRules(req,res){
    chargeDao.addRules(req.body, function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function addShippingTemplate(req,res){
    chargeDao.addShippingTemplate(req.body, function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function addShippingRules(req,res){
    chargeDao.addShippingRules(req.body, function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function delDeliveryTemplate(req,res){
    chargeDao.delDeliveryTemplate(req.params.deliveryTemplateId, function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function getDeliveryTemplate(req,res){
    var data={
        deliveryTemplateId:req.params.deliveryTemplateId,
        company_id:req.params.company_id
    }
    var result={};
    chargeDao.getShippingRuleCount(data.deliveryTemplateId);
    chargeDao.getDeliveryTemplate(data, function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        result=data;
        chargeDao.getShippingRuleCount(data.deliveryTemplateId,function(err,count){
            if(err){
                return res.json(500,err);
            }
            result.shippingRuleCount=count;
            return res.json(200, data);
        });

    });
}
function getShippingTemplate(req,res){
    var data={
        deliveryTemplateId:req.params.deliveryTemplateId,
        company_id:req.params.company_id
    }
    chargeDao.getShippingTemplate(data, function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function updateDeliveryTemplate(req,res){
    chargeDao.updateDeliveryTemplate(req.body, function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function updateShippingTemplate(req,res){
    chargeDao.updateShippingTemplate(req.body, function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function getAllDeliveryTemplate(req,res){
    chargeDao.getAllDeliveryTemplate(req.params.company_id, function (err,data) {
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
router.post("/isDeliveryTemplateNmaeExsit",isDeliveryTemplateNmaeExsit);
router.get("/getDeliveryTemplates/:page/:pageSize/:company_id",getDeliveryTemplates);
router.post("/addDeliveryTemplate",addDeliveryTemplate);
router.post("/addRules",addRules);
router.post("/addShippingTemplate",addShippingTemplate);
router.post("/addShippingRules",addShippingRules);
router.get("/delDeliveryTemplate/:deliveryTemplateId",delDeliveryTemplate);
router.get("/getDeliveryTemplate/:deliveryTemplateId/:company_id",getDeliveryTemplate);
router.get("/getShippingTemplate/:deliveryTemplateId/:company_id",getShippingTemplate);
router.post("/updateDeliveryTemplate",updateDeliveryTemplate);
router.post("/updateShippingTemplate",updateShippingTemplate);
router.get("/getAllDeliveryTemplate/:company_id",getAllDeliveryTemplate);
module.exports = router;