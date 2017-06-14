/**
 * 用户模块路由
 * Created by Administrator on 15-3-5.
 */
var userDao = require("./userModel");
var log = require("bole")("users/router");
var router = require("express").Router();
var utils = require('../lib/utils');

function login(req, res) {
    console.log("============> login");
    var username = req.body.username || '';
    var password = req.body.password || '';
    console.log("============> username   " + username);


    if (username === '' || password === '') {
        return res.send(400);
    }
    // 用户名&密码 登录
    userDao.findByUsername(username, function (err, user) {
        checkUser(req, res, err, user);
    });
}

// 登录检查
function checkUser(req, res, err, data) {
    if (!!err) {
        console.log(err);
        return res.json(500, {error: err});
    }
    if (!data || data.length == 0) {
        return res.json(400, {error: "用户不存在"});
    }
    var pwd = data[0].pwd || '';
    if (pwd === '' || pwd != req.body.password) {
        return res.json(400, {error: "用户名密码不匹配"});
    }
    //return res.json(200, {result: data[0]});
    return res.status(200).json( {result: data[0]})
}


router.post("/login", login); // 登录

module.exports = router;