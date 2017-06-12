/**
 * Created by wei on 16/1/12.
 */
var sqlClient = require('../lib/mysql/mysql');
var moment = require('moment');
var nodemailer = require('nodemailer');
var commonDao = module.exports;
var https = require('https');
var request = require('request');
var schedule=require('node-schedule');
var config=require('../../config')
var text='【天天有农】亲爱的有农商家：您好，您今天有新订单，请及时查看并发货。'
var rule = new schedule.RecurrenceRule();
rule.hour=[9,15];
rule.minute=0;
var html='<b>【天天有农】亲爱的有农商家：您好，您今天有新订单，请及时<a href="http://www.dayday7.com/supplier/#/login">查看</a>并发货。</b><div style="text-align: center;position: absolute; bottom: 0;width: 100%">天天有农 <p>Copyright &copy; 2016.苏州有农网络技术有限公司</p> </div>'
var subject ='有农订单提醒';

//预售到期job
var preRule = new schedule.RecurrenceRule();
preRule.hour=4;

schedule.scheduleJob(preRule, function () {
    var sql='select pre_delivery_time,company_goods_id from company_goods where sales_type=1';
    console.log(sql)
    sqlClient.query(sql,null,function(err, data){
        if(err){
           console.log(err)
        }
        else{
            console.log(data)
            if(data.length>0){
                data.forEach(function (item) {
                    console.log('sssssss')
                    if(moment().format('YYYY-MM-DD HH:mm:ss')>=moment(item.pre_delivery_time).format('YYYY-MM-DD HH:mm:ss')){

                        finishPre(item, function (err,data) {
                            if(err){
                                console.log(err)
                            }
                            else{
                                console.log(data)
                            }

                        })
                    }
                })
            }
        }

    })
})
var finishPre = function (data,cb) {
    var sql='update company_goods set sales_type=0 where company_goods_id='+data.company_goods_id;
    sqlClient.query(sql,null, function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }
        return cb&&cb(null, data);
    })
}
///
var transporter = nodemailer.createTransport({
    host:'smtp.exmail.qq.com',
    port:465,
    secureConnection:true,
    auth: {
        user: 'younongmall@dayday7.com',
        pass: 'Younong1234'
    }
});
/*var j = schedule.scheduleJob(rule, function(){
    accountDao.isHasNewOrder(function (err,data) {
        var phone='';
        var email='';
        if(err){
            console.log(err);
        }
        else{
            if(data!=null){
                var company_ids={};
                data.result.forEach(function (item) {
                    company_ids[item.company_id]=item.company_id
                })
                    console.log(company_ids);
                var company=[];
                for(x in company_ids){
                    company.push(company_ids[x])
                }
                company.forEach(function (item) {
                    accountDao.getCompanys(item,function(err,data){
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log(data)
                            if(data!=null){
                                email=data.result[0].remind_email;
                                phone=data.result[0].remind_phone;
                                if(phone!=null&&data.result[0].delivery_remind==1){
                                  sendSms(phone,text);
                                    console.log(phone);
                                }
                                if(email!=null&&data.result[0].delivery_remind==1){
                                    sqlClient.sendEmail(email,text,html,subject);
                                }
                            }
                        }
                    })
                })
            }
            //sendSms(phone,text);

        }

    });
});*/

//发送短信 sendSms
function sendSms(mobile,text){

    request({
        url: "https://sms.yunpian.com/v1/sms/send.json",
        method: 'POST',
        body: "apikey="+config.apikey+"&&mobile="+mobile+"&&text="+text
    }, function (err, response, body) {
        console.log(body);
        body=JSON.parse(body);
        console.log(body.code);
        if(body.code==0){
                console.log('success');
        }else{
            console.log('短信服务器故障');
        }

    });
}
commonDao.sendEmail=function(email,text,html,subject){
    var mailOptions = {
        from: '苏州有农网络技术有限公司<younongmall@dayday7.com>', // sender address
        to: email, // list of receivers
        subject:subject , // Subject line
        text:text, // plaintext body
        html: html // html body
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
}