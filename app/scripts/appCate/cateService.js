

define(['common/services'],
    function (services) {
        services.factory('CateService', function ($http,$q,Upload) {
            return{
                getCateList:function(){
                    var deferred = $q.defer();
                    $http.get('/api/cate/getCateList').success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                getCateDetail:function(data){
                    var deferred = $q.defer();
                    $http.get('/api/cate/getCateDetail/'+data).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                updateCate:function(data){
                    var deferred = $q.defer();
                    $http.post('/api/cate/updateCate',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                addCate:function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    $http.post('/api/cate/addCate',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                delCate:function(data){
                    var deferred = $q.defer();
                    $http.put('/api/cate/delCate/'+data.cateId).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
            }
        });
    });