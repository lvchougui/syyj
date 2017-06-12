/**
 * Created by zhaohui on 15-5-8.
 */
// 商品相关服务配置文件
define(['common/services'],
    function (services) {
        services.factory('OrderServices', function ($http,$q,Upload) {
            return{
                getDeliverNo:function(cb){

                    $http.get('/companyPc/api/account/getDeliverNo').success(function(res){
                        cb(null,res);
                    }).error(function(err){
                        cb(err,null)
                    })
                },
                uploadFile:function(param){
                    var deferred = $q.defer();
                    Upload.upload({
                        url: '/companyPc/api/account/getExcel',
                        data: {file:param},
                    }).then(function (resp) {
                        deferred.resolve(resp);
                    }, function (err) {
                        deferred.reject(err.status);
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ');
                    });
                    return deferred.promise;
                },
                readExcel: function (data) {
                    var deferred = $q.defer();
                    $http.get(data).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                selectRemindInformation:function(){

                    var deferred = $q.defer();
                    $http.get('/companyPc/api/account/selectRemindInformation/'+localStorage.company_id).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                updateRemindInformation: function (data) {
                    var deferred = $q.defer();
                    data.company_id=localStorage.company_id;
                    $http.post('/companyPc/api/account/updateRemindInformation',data).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
            	getOrders:function(params){
                    params.company_id=localStorage.company_id;
                    var deferred = $q.defer();
                    $http.post('/companyPc/api/account/getOrders',params).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;

            	},
                getExportExcelUrl:function(params){
                    // dateStart, dateEnd, orderStatusId, page, size
                    var urlTmpl = '/companyPc/api/account/exportExcel?company_id={company_id}&company_orders_status_id={company_orders_status_id}&page={page}&size={size}';
                    console.log(params);
                    var url = urlTmpl.replace(/{(\w+)}/g,function($0,$1){
                        return params[$1]===undefined?"":params[$1];
                    });
                    return url;
                },

                getStatusOptions:function(){
                    var deferred = $q.defer();
                    $http.get('/companyPc/api/account/getOrderStatue').success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                chgOrderStatue:function(data){
                    var deferred = $q.defer();
                    $http.post('/companyPc/api/account/chgOrderStatue',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                }

            }
        });
        services.factory('fileUpload',  function ($http) {
            return{
                uploadFileToUrl:function(file){
                    console.log(file)
                    $http.post('/companyPc/api/account/getExcel', file, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function(data){
                        console.log(data)
                        })
                        .error(function(err){
                                console.log(err)
                        });
                }
            }

        });
    });