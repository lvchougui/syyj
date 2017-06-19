var router = require("express").Router();
var cateDao = require('./cateModel');

function getCateList(req, res){
    cateDao.getCateList(function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function addCate(req, res){
    cateDao.addCate(req.body, function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function delCate(req,res){
    cateDao.delCate(req.params.cateId,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

router.get("/getCateList",getCateList);
router.post("/addCate",addCate);
router.put("/delCate/:cateId",delCate);

module.exports = router;