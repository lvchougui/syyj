var sqlClient = require('../lib/mysql/mysql');
var articleDao = module.exports;
var moment = require('moment');

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

articleDao.getArticleList = function(data,cb){
    var sql = 'select * from tb_article where status = 1 order by id desc limit ?,?';
    var sqlCount ='select count(id) as number from tb_article where status = 1';
    sqlClient.query(sql, [parseInt((data.page - 1) * data.size), parseInt(data.size)], function(err, data){
        if(err){
            return cb && cb(err, null);
        }
        var response={
            array:data,
            counts:0
        }
        if(response.array.length>0){
            sqlClient.query(sqlCount,null,function(err, data){
                response.counts=data[0].number;
                return cb&&cb(null,response);
            })
        }else{
            return cb&&cb(null,response);
        }
    })
}

articleDao.getDetail = function (articleid, cb) {
    var sql = 'select * from tb_article where status = 1 and id = '+articleid;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data[0]);
    })
}

articleDao.addArticle = function(data,cb){
    console.log(data);
    var sql = '';
    var fields = [
        'title',
        'cover',
        'detail',
        'summary',
        'create_time'
    ];
    var values=[
        '?',
        '?',
        '?',
        '?',
        '?'
    ];
    var createTime = new Date().Format("yyyy/MM/dd");

    var sqlInsert = 'insert into tb_article ('+fields.join(',')+') values ('+values.join(',') +')' ;
    // 拼接字符串
    sql += sqlInsert;
    sqlClient.query(sql,[data.title,data.cover,data.detail,data.summary,createTime],function(err, rows){
        if(err){
            return  cb&&cb(err, null);
        }else{
            if(rows.insertId > 0){
                return cb&&cb(null, {articleId:rows.insertId});
            }
            else{
                return cb&&cb(null, {articleId:0});
            }
        }
    })
}

articleDao.updateArticle = function(data,cb){
    var fields = [
        'title = ?',
        'cover = ?',
        'detail = ?',
        'summary = ?'
        ]
    //var desc = html_encode(data.detail);
    var sql = 'update tb_article set '+fields.join(',')+' where id = '+data.id;
    sqlClient.query(sql,[data.title,data.cover,data.detail,data.summary],function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}

articleDao.delArticle = function(articleId,cb){
    var sql='update tb_article set status = 0 where status = 1 and id = '+articleId;
    sqlClient.query(sql,null,function(err, data){
        if(err){
            return  cb&&cb(err, null);
        }
        return  cb&&cb(null, data.affectedRows);
    })
}
function htmlspecialchars(str)
{
    var s = "";
    if (str.length == 0) return "";
    for   (var i=0; i<str.length; i++)
    {
        switch (str.substr(i,1))
        {
            case "<": s += "&lt;"; break;
            case ">": s += "&gt;"; break;
            case "&": s += "&amp;"; break;
            case " ":
                if(str.substr(i + 1, 1) == " "){
                    s += " &nbsp;";
                    i++;
                } else s += " ";
                break;
            case "\"": s += "&quot;"; break;
            case "\n": s += "<br>"; break;
            default: s += str.substr(i,1); break;
        }
    }
    return s;
}

function html_encode(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    return s;
}

function html_decode(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
}

