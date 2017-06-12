/**
 * Created by wei on 16/1/25.
 */
var router = require("express").Router();
var addressDao = require('../address/addressModel');
var logger = require('../index').logger('index');
var moment = require('moment');//moment库是一个时间处理的库
function getCities(req,res){

    addressDao.getCities(function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, {error: err});
        }
        console.log(data)
        return res.json(200, {results: data});
    })
}
function getProvinces(req,res){

    addressDao.getProvinces(function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, {error: err});
        }
        return res.json(200, {results: data});
    })
}
/*function getCitiesByProvinceId(req,res){
    var data={
        province_id:req.params.province_id
    }
    addressDao.getCitiesByProvinceId(data,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, {error: err});
        }
        return res.json(200, {results: data});
    })
}*/
router.get("/getCities",getCities);//获得城市
//router.get("/getCitiesByProvinceId/:province_id",getCitiesByProvinceId);
router.get("/getProvinces",getProvinces);//
module.exports = router;