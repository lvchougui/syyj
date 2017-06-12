var schedule = require("node-schedule");
var moment=require('moment');
var sqlClient = require('../lib/mysql/mysql');


var rule = new schedule.RecurrenceRule();

var times = [];
for(var i=0; i<60; i++){
    times.push(i);
}
rule.minute = times;
var j = schedule.scheduleJob(rule, function(){
    pinActivityStart();
    pinActivityEnd();
});

function pinActivityStart(){

    var querySQL = 'select * from pin_activity where status = 1 and activity_status = 2 and activity_start_time < "'+
        moment().format('YYYY-MM-DD HH:mm:ss')+'"';
    console.log(querySQL);
    sqlClient.query(querySQL, null, function (err, data) {
        if (err) {

        } else {
            if(data.length > 0){
                data.forEach(function(item){
                    var sql = 'update pin_activity set activity_status = 1 where activity_status = 2 and status = 1 and id = '+item.id;
                    sqlClient.query(sql, null, function (err, data) {
                        if (err) {

                        }else{

                        }
                    });
                })
            }
        }
    });
}

function pinActivityEnd(){
    var querySQL = 'select * from pin_activity where status = 1 and activity_status = 1 and activity_end_time < "'+
        moment().format('YYYY-MM-DD HH:mm:ss')+'"';
    console.log(querySQL);
    sqlClient.query(querySQL, null, function (err, data) {
        if (err) {

        } else {
            if(data.length > 0){
                data.forEach(function(item){
                    var sql = 'update pin_activity set activity_status = 3 where activity_status = 1 and status = 1 and id = '+item.id;
                    sqlClient.query(sql, null, function (err, data) {
                        if (err) {

                        }else{

                        }
                    });
                })
            }
        }
    });
}