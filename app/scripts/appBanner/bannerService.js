

define(['common/services'],
    function (services) {
        services.factory('BannerService', function ($http,$q,Upload) {
            return{
                getBannerList:function(){
                    var deferred = $q.defer();
                    $http.get('/api/banner/getBannerList').success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                getBannerDetail:function(data){
                    var deferred = $q.defer();
                    $http.get('/api/banner/getBannerDetail/'+data).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                updateBanner:function(data){
                    var deferred = $q.defer();
                    $http.post('/api/banner/updateBanner',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                addBanner:function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    $http.post('/api/banner/addBanner',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                delBanner:function(data){
                    var deferred = $q.defer();
                    $http.put('/api/banner/delBanner/'+data.bannerId).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
            }
        });
    });