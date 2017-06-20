define(['common/services','moment'],
    function (services,moment) {
        services.factory('CertService', function ($http,$q,Upload,$cacheFactory) {
            return{

                getCertList:function(params){
                    var deferred = $q.defer();
                    $http.post('/api/cert/getCertList',params).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },

                delCert:function(data){
                    var deferred = $q.defer();
                    $http.put('/api/cert/delCert/'+data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },

                getCertDetail:function(data){
                    var deferred = $q.defer();
                    $http.get('/api/cert/getCertDetail/'+data).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },

                updateCert:function(data){
                    var deferred = $q.defer();
                    $http.post('/api/cert/updateCert',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                addCert:function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    $http.post('/api/cert/addCert',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                }
            }
        });
    });
