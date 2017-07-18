var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var path=require('path');
var moment = require('moment');
var jwt = require('jwt-simple');
var tokenMgr = require('./lib/token/tokenManager');
var ueditor = require("ueditor")
var express = require('express');

var log4js = require('log4js');

log4js.configure({
    appenders: [
        { "type": "console", "category": "console"}, //控制台输出
        {
            type: 'file', //文件输出
            filename: __dirname+'/logs/access.log',
            maxLogSize: 102400,
            backups:4,
            category: 'normal'
        }
    ],
    replaceConsole: true
});
var loggers = log4js.getLogger('normal');
loggers.setLevel('DEBUG');


exports.logger=function(name){
    var logger = log4js.getLogger('normal');
    logger.setLevel('INFO');
    return logger;
}


var apiModule = module.exports;
apiModule.init = function (app) {
    //设置跨域访问


    app.use(logger('dev'));
    app.use(bodyParser.json());
    //app.use(bodyParser.json({limit:'2048kb'}));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.static(path.join(__dirname, 'public')));

    //设置跨域访问
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,X-Yipai-Key");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By",' 3.2.1');
        if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
        else  next();
    });

    require('./lib/mysql/mysql').init();
    app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
        //客户端上传文件设置
        var imgDir = '/img/ueditor'
        var ActionType = req.query.action;
        if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
            var file_url = imgDir;//默认图片上传地址
            /*其他上传格式的地址*/
            if (ActionType === 'uploadfile') {
                file_url = '/file/ueditor/'; //附件
            }
            if (ActionType === 'uploadvideo') {
                file_url = '/video/ueditor/'; //视频
            }
            res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
            res.setHeader('Content-Type', 'text/html');
        }
        //  客户端发起图片列表请求
        else if (req.query.action === 'listimage') {
            var dir_url = imgDir;
            res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
        }
        // 客户端发起其它请求
        else {
            // console.log('config.json')
            res.setHeader('Content-Type', 'application/json');
            res.redirect('/ueditor/nodejs/config.json');
        }
    }));

    app.use("/companyPc/api/user", require("./users/router"));
    app.use("/companyPc/api/account", require("./account/accountRouter"));
    app.use("/companyPc/api/upload", require("./upload/uploadRouter"));
    app.use("/api/cate", require("./cate/cateRouter"));
    app.use("/api/banner", require("./banner/bannerRouter"));
    app.use("/api/article", require("./article/articleRouter"));
    app.use("/api/cert", require("./certificate/certRouter"));
    app.use("/api/honor", require("./honor/honorRouter"));
    app.use("/api/product", require("./product/productRouter"));

}

