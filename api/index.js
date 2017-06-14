var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var path=require('path');
var moment = require('moment');
var jwt = require('jwt-simple');
var tokenMgr = require('./lib/token/tokenManager');

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
//    app.use(bodyParser.json());
    app.use(bodyParser.json({limit:'2048kb'}));
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(multer({
        dest: "../app/public/uploads",
        //dest: "app/public/uploads",
//        changeDest: function(dest, req, res) {
//            var appRoot = req.query.app;
//            var month = moment().format('YYYYMM');
//            console.log(dest+"/"+appRoot+"/"+month);
//            return dest+"\\app\\"+month;
//
//        },
        onError: function(error, next) {

        }
    }));
    // app.use(cookieParser());

    require('./lib/mysql/mysql').init();
    // app.use(require("./site/router"));

//    app.all('/api/*', [bodyParser, function(req, res, next){
//
//        var token = (req.body && req.body.access_token || req.header.Authorization);
//        console.log(token);
//
//    }]);
    // Load module routers

    app.use("/companyPc/api/user", require("./users/router"));
    app.use("/companyPc/api/account", require("./account/accountRouter"));
    app.use("/companyPc/api/goods", require("./goods/goodsRouter"));
    app.use("/companyPc/api/pin", require("./pin/pinRouter"));
// HEAD


//
    app.use("/companyPc/api/address", require("./address/addressRouter"));
    app.use("/companyPc/api/delivery_charge", require("./delivery_charge/chargeRouter"));
    app.use("/companyPc/api/delivery_time", require("./delivery_time/timeRouter"));


    app.use("/companyPc/api/upload", require("./upload/uploadRouter"));
// yunfei
    // FINALLY, use any error handlers
    // app.use(require("./errors/notFound"));

}

