/**
 * Created by younong-3 on 2016/4/12.
 */
/**
 * Created by wei on 16/1/12.
 */

define(['common/services'],
    function (services) {
        services.factory('PinService', function ($http,$q,Upload) {
            return{
                getTuan:function(data){
                    var deferred = $q.defer();
                    data.company_id=localStorage.company_id;
                    $http.post('/companyPc/api/pin/getPinActivity',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                addActivity:function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    data.company_id=localStorage.company_id;
                    $http.post('/companyPc/api/pin/addPinActivity',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                updateActivity:function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    data.company_id=localStorage.company_id;
                    $http.post('/companyPc/api/pin/updatePinActivity',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                resize: function (data,width,height,quantity,ratio) {
                    console.log(ratio);
                    var deferred = $q.defer();

                    var k=0;
                    if(data.length!=0){
                        for(var i=0;i<data.length;i++){
                            var item=data[i];
                            if(!item){
                                k++;
                                if(i==data.length-1){
                                    deferred.resolve('success');
                                }
                            }else if(Object.prototype.toString.call(item)=="[object Undefined]"){
                                k++;
                                if(i==data.length-1){
                                    deferred.resolve('success');
                                }
                            }
                            else if(!item.resize&&(Object.prototype.toString.call(item) != "[object String]")){
                                item.number=k;
                                Upload.resize(item,width,height,quantity,'image/jpeg',ratio,true).then(function(resizedFile){
                                    data[resizedFile.number]=resizedFile;
                                    resizedFile.resize=true;
                                    k++;
                                    if(i==k){
                                        deferred.resolve('success');
                                    }
                                });
                            }else{
                                k++;
                                if(i==data.length-1){
                                    deferred.resolve('success');
                                }
                            }
                        }
                    }else{
                        deferred.resolve('success');
                    }

                    return deferred.promise;
                },

                getCompanyGoodsDetail:function(data){
                    var deferred = $q.defer();
                    $http.get('/companyPc/api/goods/getGoodsDetail/'+data.company_goods_id).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                getActivityDetail:function(data){
                    var deferred = $q.defer();
                    $http.get('/companyPc/api/pin/getPinActivityDetail/'+data.activity_id).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },



                remPinActivity:function(data){
                    var deferred = $q.defer();
                    $http.put('/companyPc/api/pin/remPinActivity/'+data.activity_id).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                delPinActivity:function(data){
                    var deferred = $q.defer();
                    $http.put('/companyPc/api/pin/delPinActivity/'+data.activity_id).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
            }
        });
    });
