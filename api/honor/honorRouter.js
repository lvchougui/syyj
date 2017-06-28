var router = require("express").Router();
var honorDao = require('./honorModel');

function getHonorList(req, res){
    honorDao.getHonorList(req.body,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function addHonor(req, res){
    honorDao.addHonor(req.body, function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function delHonor(req,res){
    honorDao.delHonor(req.params.honorId,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

function updateHonor(req,res){
    honorDao.updateHonor(req.body,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

function getHonorDetail(req,res){
    honorDao.getDetail(req.params.honorId,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

router.post("/getHonorList",getHonorList);
router.get("/getHonorDetail/:honorId",getHonorDetail);
router.post("/addHonor",addHonor);
router.post("/updateHonor",updateHonor);
router.put("/delHonor/:honorId",delHonor);

module.exports = router;