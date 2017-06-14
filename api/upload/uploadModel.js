/**
 * Created by wei on 16/1/25.
 */
var uploadDao = module.exports;
var moment = require('moment');//moment库是一个时间处理的库
var path=require('path')
var qiniu = require("qiniu");


qiniu.conf.ACCESS_KEY = 'gR_JcvS-TuPlcHAaF4ctVjjiIjYIk_vNyCBisF5z';
qiniu.conf.SECRET_KEY = '3ZhdUCBz-QGUjxML3B0a7GF7MvdAPyQP-ycWwm1W';
//构建上传策略函数
function uptoken() {
    var putPolicy = new qiniu.rs.PutPolicy('syyjimg'+":"+Date.parse(new Date()));
    return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if(!err) {
            // 上传成功， 处理返回值
            //console.log(ret.hash, ret.key, ret.persistentId);
            console.log(ret)
            return cb&&cb(null, {result:ret});
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
            return  cb&&cb(err, null);
        }
    });
}

uploadDao.upload = function(data,cb){
    //调用uploadFile上传
    uploadFile(uptoken, key, data.index_img);
}



