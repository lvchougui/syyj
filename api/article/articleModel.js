var sqlClient = require('../lib/mysql/mysql');
var articleDao = module.exports;
var moment = require('moment');


var getList =function(data,cb){
    var sql = 'select * from tb_article where status = 1 and cateId = '+data.id;
    sqlClient.query(sql,null,function (err,data) {
        if(err){
            return  cb&&cb(err, null);
        }else{
            return cb&&cb(null,data);
        }
    })
}
articleDao.getAll = function(cb){
    var sql1 = "select * from tb_cate where status = 1";
    var i=0;
    sqlClient.query(sql1, null, function(err, datas){
        if(err){
            return cb && cb(err, null);
        }
        if(datas.length>0){
            datas.forEach(function (item) {
                var response= {
                    data: datas,
                }
                getList(item,function (err,res) {
                    if(err){
                        return  cb&&cb(err, null);
                    }
                    i++;
                    item.list=res;
                    if(i==datas.length){
                        return cb&&cb(null,response);
                    }
                })
            })
        }else{
            return cb&&cb(null,response);
        }
    })

}

articleDao.getArticleList = function(data,cb){
    var sql = 'select * from tb_article where status = 1 limit ?,?';
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
        'detail',
        'cateId'
    ];
    var values=[
        '?',
        '?',
        '?'
    ];

    var sqlInsert = 'insert into tb_article ('+fields.join(',')+') values ('+values.join(',') +')' ;
    // 拼接字符串
    sql += sqlInsert;
    sqlClient.query(sql,[data.title,data.detail,data.cateId],function(err, rows){
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
        'detail = ?',
        'cateId = ?'
        ]
    //var desc = html_encode(data.detail);
    var sql = 'update tb_article set '+fields.join(',')+' where id = '+data.id;
    sqlClient.query(sql,[data.title,data.detail,data.cateId],function(err, data){
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