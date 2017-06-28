define(['common/services','moment'],
    function (services,moment) {
        services.factory('HonorService', function ($http,$q,Upload,$cacheFactory) {
            return{

                getHonorList:function(params){
                    var deferred = $q.defer();
                    $http.post('/api/honor/getHonorList',params).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },

                delHonor:function(data){
                    var deferred = $q.defer();
                    $http.put('/api/honor/delHonor/'+data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },

                getHonorDetail:function(data){
                    var deferred = $q.defer();
                    $http.get('/api/honor/getHonorDetail/'+data).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },

                updateHonor:function(data){
                    var deferred = $q.defer();
                    $http.post('/api/honor/updateHonor',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                addHonor:function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    $http.post('/api/honor/addHonor',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                }
            }
        });
    });
