/**
 * Created by younong-3 on 2016/4/12.
 */
/**
 * Created by wei on 16/1/12.
 */

define(['common/services'],
    function (services) {
        services.factory('SalesService', function ($http,$q,Upload) {
            return{
                getCompanyGoods:function(data){
                    var deferred = $q.defer();
                    data.company_id=localStorage.company_id;
                    $http.post('/companyPc/api/goods/getGoods',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                getGoodsByCompanyGoodsStatue:function(){
                    var deferred = $q.defer();
                    $http.get('/companyPc/api/goods/getGoodsByCompanyGoodsStatue/'+localStorage.company_id).success(function(res){
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
                                defer.reject('删除失败')
                            });
                    }else{
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
                updateGoodsActivityIcon:function(data){
                    var deferred = $q.defer();
                    $http.post('/companyPc/api/goods/updateGoodsActivityIcon',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
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
                },
                getGoodsByCompanyGoodsSkuStatue:function(data){
                    var deferred = $q.defer();
                    console.log(data);
                    $http.get('/companyPc/api/goods/getGoodsByCompanyGoodsSkuStatue/'+data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                updateSalePrice:function(data){
                    var deferred = $q.defer();
                    $http.get('/companyPc/api/goods/updateSalePrice/'+data.company_goods_sku_id).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
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
                chgCompanyGoodsStatue:function(data){
                    var deferred = $q.defer();
                    $http.post('/companyPc/api/goods/updateGoodsStatueForOneByOne',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
           /*     chgCompanyGoodsAndGoodsSku:function(data){
                    var deferred = $q.defer();
                    $http.put('/companyPc/api/goods/updateGoodsAndGoodsSku/'+data.company_goods_id).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },*/
                chgComanyGoodsSku:function(data){
                    var deferred = $q.defer();
                    $http.post('/companyPc/api/goods/updateGoodsSku',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                getActivity:function(){

                    var deferred = $q.defer();
                    $http.get('/companyPc/api/goods/getActivity/'+parseInt(localStorage.company_type)).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                chgCompanyGoods:function(data){
                    var deferred = $q.defer();
                    $http.post('/companyPc/api/goods/updateGoods',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                addCompanyGoods:function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    $http.post('/companyPc/api/goods/addGoods',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                updateSkuAndGoods:function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    $http.post('/companyPc/api/goods/updateSkuAndGoods',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                getCategories:function(data){
                    var deferred = $q.defer();
                    $http.get('/companyPc/api/goods/getCategory').success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
            /*    getSku:function(data){
                    var deferred = $q.defer();
                    $http.get('/companyPc/api/goods/getSku/'+data.company_goods_id).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },*/
                getGoodsStatue:function(data){
                    var deferred = $q.defer();
                    $http.get('/companyPc/api/goods/getGoodsStatue').success(function(res){
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
                                Upload.resize(item,width,height,quantity,'image/jpeg',ratio,true).then(function(resizedFile){
                                    data[k]=resizedFile;
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
                                defer.reject('删除失败')
                            });
                    }else{
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
