/**
 * Created by younong-3 on 2016/5/30.
 */
/**
 * Created by wei on 16/1/12.
 */

define(['common/services'],
    function (services) {
        services.factory('StoreService', function ($http,$q,Upload) {
            return{

                updateConfig: function (data) {
                    var deferred = $q.defer();
                    $http.post('/companyPc/api/account/chgConfig',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                getConfig:function(){
                    var data={}
                    var deferred = $q.defer();
                    $http.get('/companyPc/api/account/getConfig').success(function(res){
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
                delImg:function(icon,img){
                    console.log(icon);
                    console.log(img);
                    var defer = $q.defer();
                    console.log({data:icon});
                    if(icon&&(icon.length!=0)){
                        $http(
                            {method:"post",
                                url:IconIp+"api/attachment/del",
                                contentType: "application/json;charset=utf-8",
                                data: JSON.stringify({data:icon})
                            }
                        ).success(function(res){
                                defer.resolve(res);
                            }).error(function(err){
                                console.log('删除失败');
                                defer.reject('删除失败')
                            });
                    }else{
                        console.log('不需要删除啪啪啪');
                        defer.resolve('不需要删除icon');
                    }
                    if(img&&(img.length!=0)){
                        console.log({data:img});
                        $http(
                            {method:"post",
                                url:ImgIp+"api/attachment/del",
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify({data:img})
                            }
                        ).success(function(res){
                                defer.resolve(res);
                            }).error(function(err){
                                defer.reject('删除失败')
                            });
                    }else{
                        defer.resolve('不需要删除img');
                    }
                    return defer.promise;
                },
                uploadImg:function(url,param){
                    var deferred = $q.defer();
                    Upload.upload({
                        url: url,
                        data: {files:param}
                    }).then(function (resp) {
                        deferred.resolve(resp);
                    }, function (err) {
                        deferred.reject(err.status);
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ');
                    });
                    return deferred.promise;
                }
            }
        });
    });
