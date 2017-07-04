var router = require("express").Router();
var bannerDao = require('./bannerModel');

function getBannerList(req, res){
    bannerDao.getBannerList(function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function addBanner(req, res){
    bannerDao.addBanner(req.body, function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function delBanner(req,res){
    bannerDao.delBanner(req.params.bannerId,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

function updateBanner(req,res){
    bannerDao.updateBanner(req.body,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

function getBannerDetail(req,res){
    bannerDao.getDetail(req.params.bannerId,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

router.get("/getBannerList",getBannerList);
router.post("/addBanner",addBanner);
router.put("/delBanner/:bannerId",delBanner);
router.get("/getBannerDetail/:bannerId",getBannerDetail);
router.post("/updateBanner",updateBanner);

module.exports = router;