var router = require("express").Router();
var certDao = require('./certModel');

function getCertList(req, res){
    certDao.getCertList(req.body,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function addCert(req, res){
    certDao.addCert(req.body, function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function delCert(req,res){
    certDao.delCert(req.params.certId,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

function updateCert(req,res){
    certDao.updateCert(req.body,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

function getCertDetail(req,res){
    certDao.getDetail(req.params.certId,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function getFrontCertDetail(req,res){
    certDao.getDetail(req.params.certCode,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

router.post("/getCertList",getCertList);
router.get("/getCertDetail/:certId",getCertDetail);
router.get("/getFrontCertDetail/:certCode",getFrontCertDetail);
router.post("/addCert",addCert);
router.post("/updateCert",updateCert);
router.put("/delCert/:certId",delCert);

module.exports = router;