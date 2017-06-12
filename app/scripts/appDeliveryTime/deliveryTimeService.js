

define(['common/services'],
    function (services) {
        services.factory('DeliveryTimeService', function ($http,$q,Upload) {
            return{
                getTimeList:function(){
                    var deferred = $q.defer();
                    var company_id=localStorage.company_id;
                    $http.get('/companyPc/api/delivery_time/getTimeList/'+company_id).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                addDeliveryTime:function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    data.company_id=localStorage.company_id;
                    $http.post('/companyPc/api/delivery_time/addDeliveryTime',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                delDeliveryTime:function(data){
                    var deferred = $q.defer();
                    $http.put('/companyPc/api/delivery_time/delDeliveryTime/'+data.delivery_time_id).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
            }
        });
    });