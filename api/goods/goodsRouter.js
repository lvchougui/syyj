/**
 * Created by wei on 16/1/19.
 */
var router = require("express").Router();
var goodsDao = require('./goodsModel');
var logger = require('../index').logger('index');

//获取分类
function getCategory(req,res){
    goodsDao.getCategory(null,function(err,data){
        if(err){
            console.log('test');
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function updateSalePrice(req,res){
    data={company_goods_sku_id:req.params.company_goods_sku_id};
    goodsDao.updateSalePrice(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
//获取供应商商品
function getGoods(req,res){
    console.log("传入的参数！！");
    console.log(req.body);
    logger.info(req.body);

    goodsDao.getGoods(req.body,function(err,data){
        if(err){
            console.log('dadadada');
            return res.json(500,err);
        }


        logger.info(data);
        return res.json(200, data);
    });
}

//获取商品详情
function getGoodsDetail (req,res){
    var data={
        company_goods_id:req.params.company_goods_id
    }
    logger.info(data);
    goodsDao.getGoodsDetail(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        //logger.info(data);
        return res.json(200, data);
    });
}

//新建商品
function  addGoods (req,res){
    //logger.info(req.body);
    console.log("商品信息：");
    console.log(req.body.areas_id);

    goodsDao.addGoods(req.body,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}

//修改商品
function updateGoods (req,res){
    console.log('ddw')
    console.log(req.body);

    logger.info(req.body);
    goodsDao.updateGoods(req.body,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}

//修改商品状态
function updateGoodsStatue(req,res){
    var data={
        company_goods_id:req.params.company_goods_id,
        company_goods_status_id:req.params.company_goods_status_id,
        statue:req.params.statue
    }
    goodsDao.updateGoodsStatue(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });

}
//买一送一
function updateGoodsStatueForOneByOne(req,res){
    console.log("执行了");
    goodsDao.updateGoodsStatueForOneByOne(req.body,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });

}
function updateGoodsAndGoodsSku(req,res){
    var data={
        company_goods_id:req.params.company_goods_id,
    }
    goodsDao.updateGoodsAndGoodsSku(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });

}
//获取商品总数
function getGoodsCount(req,res){
    var data={
        company_id:req.params.company_id
    }
    logger.info(data);
    goodsDao.getGoodsCount(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}

//获取商品状态
function getGoodsStatue(req,res){
    goodsDao.getGoodsStatue(null,function(err,data){
        if(err){
            console.log(err);
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}

//修改商品的sku
function updateGoodsSku(req,res){
    logger.info(req.body);
    goodsDao.updateGoodsSku(req.body,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function getGoodsByCompanyGoodsStatue(req,res){
    var data={
        company_id:req.params.company_id
    }
    logger.info(data);
    goodsDao.getGoodsByCompanyGoodsStatue(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function getGoodsByCompanyGoodsSkuStatue(req,res){
    var data={
        company_goods_id:req.params.company_goods_id
    }
    logger.info(data);
    goodsDao.getGoodsByCompanyGoodsSkuStatue(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function updateSkuAndGoods(req,res){
    var data=req.body;
    logger.info(data);
    goodsDao.updateSkuAndGoods(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function getActivity(req,res){
    goodsDao.getActivity(req.params.company_type,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
function updateGoodsActivityIcon(req,res){
    goodsDao.updateGoodsActivityIcon(req.body,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}
/*function getSku(req,res){
    var data={
        company_goods_id:req.params.company_goods_id
    }
    logger.info(data);
    goodsDao.getSku(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        logger.info(data);
        return res.json(200, data);
    });
}*/
// 城市
function getCities(req, res){
    goodsDao.getCities(function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, {error: err});
        }
        return res.json(200, {results: data});
    })
}
function getCitiesByProvinceId(req, res){
    var data={
        province_id:req.params.province_id
    }
    goodsDao.getCitiesByProvinceId(data,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, {error: err});
        }
        return res.json(200, {results: data});
    })
}
function getProvinces(req, res){
    goodsDao.getProvinces(function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, {error: err});
        }
        return res.json(200, {results: data});
    })
}
function getCity(req,res){
    goodsDao.getCity(req.params.city_id, function (err,data) {
        if (!!err) {
            console.log(err);
            return res.json(500, {error: err});
        }
        return res.json(200,  data);
    })
}
//获取商品分享信息
function getShareDetail (req,res){
    var data={
        company_goods_id:req.params.company_goods_id
    }
    logger.info(data);
    goodsDao.getGoodsShareInfo(data,function(err,data){
        if(err){
            return res.json(500,err);
        }
        //logger.info(data);
        return res.json(200, data);
    });
}

function getDistricts(req,res){
    var data={
        city_id:req.params.city_id
    }
    goodsDao.getDistricts(data,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, {error: err});
        }
        return res.json(200, {results: data});
    })
}

router.get("/getGoodsStatue", getGoodsStatue); //获取商品状态
router.get("/getCategory", getCategory); //获取商品分类
router.post("/getGoods", getGoods); //获取商品
router.get("/getGoodsByCompanyGoodsStatue/:company_id", getGoodsByCompanyGoodsStatue); //获取商品详情
router.get("/getGoodsByCompanyGoodsSkuStatue/:company_goods_id", getGoodsByCompanyGoodsSkuStatue); //获取商品详情
router.get("/getGoodsDetail/:company_goods_id", getGoodsDetail); //获取商品详情
router.post("/addGoods", addGoods);//新建商品
router.post("/updateGoods", updateGoods);//修改商品
router.put("/updateGoodsStatue/:company_goods_id/:company_goods_status_id/:statue", updateGoodsStatue);//修改商品状态
router.put("/updateGoodsAndGoodsSku/:company_goods_id", updateGoodsAndGoodsSku);//恢复商品不属于促销商品
router.post("/updateGoodsSku", updateGoodsSku);//修改商品
//router.get("/getSku/:company_goods_id", getSku);//获取Sku
router.post("/updateSkuAndGoods", updateSkuAndGoods);//修改商品
router.post("/updateGoodsStatueForOneByOne", updateGoodsStatueForOneByOne);//买一送一
router.get("/updateSalePrice/:company_goods_sku_id", updateSalePrice);
router.get("/getActivity/:company_type", getActivity);
router.post("/updateGoodsActivityIcon", updateGoodsActivityIcon);//修改商品
router.get("/getProvinces", getProvinces);
router.get("/getCitiesByProvinceId/:province_id",getCitiesByProvinceId);//获得城市
router.get("/getCity/:city_id",getCity);//获得城市
router.get("/getCities",getCities);//获得城市
router.get("/getGoodsShareInfo/:company_goods_id", getShareDetail); //获取商品分享信息
router.get("/getDistricts/:city_id",getDistricts);//获得城市

module.exports = router;