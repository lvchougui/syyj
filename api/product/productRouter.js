var router = require("express").Router();
var productDao = require('./productModel');

function getProductList(req, res){
    productDao.getProductList(req.body,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function addProduct(req, res){
    productDao.addProduct(req.body, function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

function delProduct(req,res){
    productDao.delProduct(req.params.productId,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

function soldProduct(req,res){
    productDao.soldProduct(req.params.productId,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

function updateProduct(req,res){
    productDao.updateProduct(req.body,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500,  err);
        }
        return res.json(200,{results:data});
    })
}

function getProductDetail(req,res){
    productDao.getDetail(req.params.productId,function(err, data){
        if (!!err) {
            console.log(err);
            return res.json(500, err);
        }
        return res.json(200, data);
    })
}

router.post("/getProductList",getProductList);
router.get("/getProductDetail/:productId",getProductDetail);
router.post("/addProduct",addProduct);
router.post("/updateProduct",updateProduct);
router.put("/delProduct/:productId",delProduct);
router.put("/soldProduct/:productId",soldProduct);

module.exports = router;