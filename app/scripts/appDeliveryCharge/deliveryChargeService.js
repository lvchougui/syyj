/**
 * Created by younong-3 on 2016/5/30.
 */
/**
 * Created by wei on 16/1/12.
 */

define(['common/services'],
    function (services) {
        services.factory('DeliveryChargeService', function ($http,$q,Upload) {
            var east_china={china_id:1,name:'华东',flag:false,shippingFlag:false,province:[{province_id:3,province_name:'上海',flag:false,shippingFlag:false},{province_id:7,province_name:'江苏',shippingFlag:false,flag:false},{province_id:18,province_name:'安徽',shippingFlag:false,flag:false},{province_id:19,province_name:'浙江',shippingFlag:false,flag:false},{province_id:23,province_name:'江西',shippingFlag:false,flag:false}]}
            var north_china={china_id:2,name:'华北',flag:false,shippingFlag:false,province:[{province_id:1,province_name:'北京',shippingFlag:false,flag:false},{province_id:4,province_name:'天津',shippingFlag:false,flag:false},{province_id:12,province_name:'山西',shippingFlag:false,flag:false},{province_id:17,province_name:'山东',shippingFlag:false,flag:false},{province_id:11,province_name:'河北',shippingFlag:false,flag:false},
                {province_id:16,province_name:'内蒙古',shippingFlag:false,flag:false}]}
            var centra_china={china_id:3,name:'华中',flag:false,shippingFlag:false,province:[{province_id:21,province_name:'湖南',shippingFlag:false,flag:false},{province_id:8,province_name:'湖北',shippingFlag:false,flag:false},{province_id:13,province_name:'河南',shippingFlag:false,flag:false}]}
            var south_china={china_id:4,name:'华南',flag:false,shippingFlag:false,province:[{province_id:2,province_name:'广东',shippingFlag:false,flag:false},{province_id:22,province_name:'广西',shippingFlag:false,flag:false},{province_id:20,province_name:'福建',shippingFlag:false,flag:false},{province_id:27,province_name:'海南',shippingFlag:false,flag:false}]}
            var east_north_china={china_id:5,name:'东北',flag:false,shippingFlag:false,province:[{province_id:6,province_name:'辽宁',shippingFlag:false,flag:false},{province_id:14,province_name:'吉林',shippingFlag:false,flag:false},{province_id:15,province_name:'黑龙江',shippingFlag:false,flag:false}]}
            var west_north_china={china_id:6,name:'西北',flag:false,shippingFlag:false,province:[{province_id:10,province_name:'陕西',shippingFlag:false,flag:false},{province_id:31,province_name:'新疆',shippingFlag:false,flag:false},{province_id:28,province_name:'甘肃',shippingFlag:false,flag:false},
                {province_id:29,province_name:'宁夏',shippingFlag:false,flag:false},{province_id:30,province_name:'青海',shippingFlag:false,flag:false}
            ]}
            var west_south_china={china_id:7,name:'西南',flag:false,shippingFlag:false,province:[{province_id:5,province_name:'重庆',shippingFlag:false,flag:false},{province_id:25,province_name:'云南',shippingFlag:false,flag:false},{province_id:24,province_name:'贵州',shippingFlag:false,flag:false},
                {province_id:26,province_name:'西藏',shippingFlag:false,flag:false},{province_id:9,province_name:'四川',shippingFlag:false,flag:false}
            ]}
           var china=[east_china,north_china,centra_china,south_china,east_north_china,west_north_china,west_south_china];
            var getCities = function (cb) {
                $http.get('/companyPc/api/address/getCities').success(function(data){
                    cb(null, data)
                }).error(function(err){
                    cb(err, null)
                })
            }
            var cities=[];
            getCities(function (err,data) {
                if(err){
                    console.log(err)
                }else{
                    console.log(data)
                    for(var i=1;i<32;i++){
                        cities.push({province_id:i,cities:[]})
                    }
                    data.results.forEach(function (item) {
                        for(var i=0;i<cities.length;i++){
                            if(cities[i].province_id==item.province_id){
                                item.flag=false;
                                item.shippingFlag=false;
                                cities[i].cities.push(item);
                                break;
                            }
                        }
                    })
                    //console.log(cities)
                }
            })
            return{
                getChina:function(){
                    return china;
                },
                getCities:function(cb){
                    console.log("什么鬼");
                    console.log(cities);
                    return cities;

                },
           /*     getCities:function(cb){
                    $http.get('/companyPc/api/address/getCities').success(function(data){
                        cb(null, data)
                    }).error(function(err){
                        cb(err, null)
                    })
                },*/
                getProvinces:function(cb){
                    $http.get('/companyPc/api/address/getProvinces').success(function(data){
                        cb(null, data)
                    }).error(function(err){
                        cb(err, null)
                    })
                },
                addDeliveryTemplate:function(data,cb){
                    data.company_id=localStorage.company_id;
                    $http.post('/companyPc/api/delivery_charge/addDeliveryTemplate',data).success(function (data) {
                        cb(null, data)
                    }).error(function (err) {
                        cb(err, null)
                    })
                },
                addRules:function(data,cb){
                    $http.post('/companyPc/api/delivery_charge/addRules',data).success(function (data) {
                        cb(null, data)
                    }).error(function (err) {
                        cb(err, null)
                    })
                },
                addShippingTemplate:function(data,cb){
                    data.company_id=localStorage.company_id;
                    $http.post('/companyPc/api/delivery_charge/addShippingTemplate',data).success(function (data) {
                        cb(null, data)
                    }).error(function (err) {
                        cb(err, null)
                    })
                },
                addShippingRules:function(data,cb){
                    $http.post('/companyPc/api/delivery_charge/addShippingRules',data).success(function (data) {
                        cb(null, data)
                    }).error(function (err) {
                        cb(err, null)
                    })
                },
                getDeliveryTemplates:function(page,pageSize,cb){
                    console.log('dddddd');
                    $http.get('/companyPc/api/delivery_charge/getDeliveryTemplates/'+page+'/'+pageSize+'/'+localStorage.company_id).success(function (data) {
                        cb(null, data)
                    }).error(function (err) {
                        cb(err, null)
                    })
                },
                delDeliveryTemplate:function(deliveryTemplateId,cb){
                    $http.get('/companyPc/api/delivery_charge/delDeliveryTemplate/'+deliveryTemplateId).success(function (data) {
                        cb(null, 'success')
                    }).error(function (err) {
                        cb('failer', null)
                    })
                },
                getDeliveryTemplate:function(deliveryTemplateId,cb){
                    $http.get('/companyPc/api/delivery_charge/getDeliveryTemplate/'+deliveryTemplateId+'/'+localStorage.company_id).success(function (data) {
                        cb(null, data)
                    }).error(function (err) {
                        cb(err, null)
                    })
                },
                getShippingTemplate:function(deliveryTemplateId,cb){
                    $http.get('/companyPc/api/delivery_charge/getShippingTemplate/'+deliveryTemplateId+'/'+localStorage.company_id).success(function (data) {
                        cb(null, data)
                    }).error(function (err) {
                        cb(err, null)
                    })
                },
                updateDeliveryTemplate:function(data,cb){
                    $http.post('/companyPc/api/delivery_charge/updateDeliveryTemplate',data).success(function (data) {
                        cb(null, data)
                    }).error(function (err) {
                        cb(err, null)
                    })
                },
                updateShippingTemplate:function(data,cb){
                    console.log(data);
                    $http.post('/companyPc/api/delivery_charge/updateShippingTemplate',data).success(function (data) {
                        cb(null, data)
                    }).error(function (err) {
                        cb(err, null)
                    })
                },
                isDeliveryTemplateNmaeExsit:function(data,cb){
                    data.company_id=localStorage.company_id;
                    $http.post('/companyPc/api/delivery_charge/isDeliveryTemplateNmaeExsit',data).success(function (data) {
                        cb(null, data)
                    }).error(function (err) {
                        cb(err, null)
                    })
                },
            }
        });
    });
