define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('PreStoreCtrl',function ($scope,StoreService,$stateParams,errMap,$state,validation,$q) {
            var errStatueMap=errMap.getMap();
            var imgArray=[];
            $scope.files=[];
            $scope.covers='';
            $scope.configs={
                index_img:null,
                img_href:null,
                master_desc:null
            }

            var waitDelImg={
                icon:[],
                img:[]
            };
            $scope.files=[];
            console.log('===========');
            var load = function () {
                console.log('======1111=====');
                StoreService.getConfig().then(function(data){
                    console.log(data.result[0]);
                    if(data.length!=0){
                        $scope.configs=data.result[0];
                        if( $scope.configs.index_img!=null){
                            //$scope.covers= IconIp+$scope.configs.index_img;
                            //console.log( $scope.covers)
                        }

                    }
                },function(err){
                    console.log(err);
                })
            }
            load()

        });
        controllers.controller('StoreCtrl',function ($scope,StoreService,$stateParams,errMap,$state,validation,$q) {
            var errStatueMap=errMap.getMap();
            var imgArray=[];
            $scope.files=[];
            $scope.covers='';
            $scope.store={
                store_id:0,
                store_logo:null,
                store_detail_img:null,
                store_name:null,
                store_describtion:null
            }
            $scope.shippingTemplate={
                shippingTemplate_id:0,
                shippingTemplate_name:'未选择包邮模板'
            }
            $scope.allShippingTemplate=[];
            var waitDelImg={
                icon:[],
                img:[]
            };
            $scope.files=[];
            var load = function () {
                StoreService.getStore().then(function(data){
                    if(data.length!=0){
                        $scope.store=data[0];
                        if( $scope.store.store_logo!=null){
                            $scope.covers= IconIp+$scope.store.store_logo;
                            console.log( $scope.covers)
                        }
                        if($scope.store.store_detail_img!=null){
                            console.log('dsd')
                            imgArray=$scope.store.store_detail_img.split(';')
                            imgArray.pop();
                            imgArray.forEach(function(item){
                                $scope.files.push(item);
                            })
                            for(var i in $scope.files){
                                $scope.files[i]=ImgIp+$scope.files[i];
                            }
                        }
                        console.log(data)
                    }

                    StoreService.getShippingTemplate().then(function(data){

                        if(data.length>0){
                            $scope.shippingTemplate.shippingTemplate_id=data[0].shippingTemplate_id;
                            $scope.shippingTemplate.shippingTemplate_name=data[0].shippingTemplate_name;
                        }
                        StoreService.getAllShippingTemplate().then(function(data){
                            $scope.allShippingTemplate=data;
                            if($scope.shippingTemplate.shippingTemplate_id==0){
                                console.log("我执行了吗");
                                var shippingTemplate={
                                    shippingTemplate_id:0,
                                    shippingTemplate_name:'未选择包邮模板'
                                };
                                $scope.allShippingTemplate.push(shippingTemplate);
                            }
                            console.log($scope.allShippingTemplate);
                        },function(err){
                            console.log(err);
                        })

                    },function(err){
                        console.log(err);
                    })

                },function(err){
                    console.log(err)
                })
            }



            load()

            $scope.uploadDetail=function($files, $file){
                console.log($files);
                $scope.files=$files;
            }

            $scope.upload=function($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event){
                console.log($files);
                if($file){
                    $scope.covers=$file;
                    console.log(Object.prototype.toString.call($scope.store.store_logo));
                    if(Object.prototype.toString.call($scope.store.store_logo) == "[object String]"){
                        waitDelImg.icon.push($scope.store.store_logo);
                        console.log('ds')
                    }
                }
            }
            $scope.drop=function(index){
                if(Object.prototype.toString.call($scope.files[index]) == "[object String]"){
                    waitDelImg.img.push(imgArray[index]);
                }
                $scope.files.splice(index,1);

            }
            $scope.replace=function($file,index){
                console.log(index);
                if(Object.prototype.toString.call($scope.files[index]) == "[object String]"){
                    waitDelImg.img.push(imgArray[index]);
                }
                $scope.files[index]=$file;
            }
            $scope.save=function(){
                $scope.store.shippingTemplate_id=$scope.shippingTemplate.shippingTemplate_id;

                //$scope.store.shippingTemplate_name=$scope.shippingTemplate.shippingTemplate_name;
                console.log($scope.store);
                //return;

                $("button").attr("disabled","disabled");
                    var res=validate();
                    if(res){
                        $("button").removeAttr("disabled");
                        return alert(errStatueMap[res]);
                    }

                var arr=[$scope.covers];
                console.log(arr[0]);
                if($scope.covers){
                    var iconResize= StoreService.resize(arr,750,300,0.5,'22:10');
                    iconResize.then(function(data){
                        $scope.store.store_logo=arr[0];
                    },function(err){
                        console.log(err);
                    })
                }
                console.log($scope.files);
                var imgResize= StoreService.resize($scope.files,null,null,0.3,null);
                imgResize.then(function(data){
                },function(err){
                    console.log(err)
                });
                var promiseResizeAll = $q.all([imgResize, iconResize]);
                promiseResizeAll.then(function(data) {
                    if($scope.store.store_id == 0){    //如果店铺不存在，添加店铺
                        console.log('re')
                        addSave(function(err,data){
                            if(err){
                                alert(errStatueMap[err]);
                                $("button").removeAttr("disabled");
                            }else{
                              $state.go('home.preStore');
                            }
                        });
                    }else{          //如果店铺已经存在，修改店铺
                        console.log('gfd ')
                        var k=0;
                        updateSave(function(err,data){
                            k++;
                            if(!err||!data){
                                alert('修改出错');
                                $("button").removeAttr("disabled");
                                k=0;
                            }
                            if(k==2){        //当添加完两张图片后，更新其他信息
                                console.log('das ')
                                var chgStore= StoreService.updateStore($scope.store);
                                chgStore.then(function(res){
                                    $state.go('home.preStore');
                                       // load()
                                },function(err){
                                    $("button").removeAttr("disabled");

                                    console.log(err);
                                })
                            }
                        });
                    }

                }, function(err) {

                });
            }

            function addSave (cb){
                console.log('保存图片');
                console.log($scope.files);
                $scope.files.splice($scope.files.length-1,1);
                var uploadImgPromise=StoreService.uploadImg(imgUploadIP,$scope.files);
                uploadImgPromise.then(function(res){
                    $scope.store.store_detail_img='';
                    res.data.path.forEach(function(item){
                        $scope.store.store_detail_img+=item+';';
                    })
                    imgArray=$scope.store.store_detail_img.split(';')
                    console.log(imgArray)
                    imgArray.pop();
                    console.log(imgArray)
                    imgArray.forEach(function(item){
                        $scope.files.push(item);
                    })
                    console.log($scope.files);
                    for(var i in $scope.files){
                        $scope.files[i]=ImgIp+$scope.files[i];
                    }
                },function(err){
                    console.log(err);
                },function(update){
                    console.log(update);
                });
                var uploadIconPromise=StoreService.uploadImg(iconUploadIP,$scope.store.store_logo);
                uploadIconPromise.then(function(res){
                    $scope.store.store_logo=res.data.path;
                },function(err){
                    console.log(err);
                },function(update){
                    console.log(update);
                });

                var promiseUploadAll=$q.all([uploadImgPromise,uploadIconPromise]);
                promiseUploadAll.then(function(data){
                    console.log($scope.store);
                    var addStore=StoreService.addStore($scope.store);
                    addStore.then(function(data){
                        console.log(data);
                        cb(null,true);
                    },function(err){
                        cb(err,null);
                    })

                },function(err){

                })
            }

            function updateSave(cb){
                var delImg=StoreService.delImg(waitDelImg.icon,waitDelImg.img);
                delImg.then(function(res){
                    console.log(res);
                },function(err){
                    console.log(err);
                },function(update){
                    console.log(update);
                });
                console.log(waitDelImg);

                if(waitDelImg.icon.length!=0||(Object.prototype.toString.call($scope.store.store_logo) != "[object String]")){
                    var uploadIconPromise=StoreService.uploadImg(iconUploadIP,$scope.store.store_logo);
                    uploadIconPromise.then(function(res){
                      $scope.store.store_logo=res.data.path;
                        cb(true,true);
                    },function(err){
                        cb(false,true);
                        console.log(err);
                    },function(update){
                        console.log(update);
                    });
                }else {
                    cb(true,true);
                    console.log($scope.store.store_logo);
                    if($scope.store.store_logo)$scope.store.store_logo=$scope.store.store_logo.substring(IconIp.length,$scope.store.store_logo.length);
                }


                var imgArray=[];
                for(var i=0;i<$scope.files.length;i++){
                    var item=$scope.files[i];
                    if(Object.prototype.toString.call(item) != "[object String]"){
                        imgArray.push(item);
                        console.log(item);
                        $scope.files[i]=i;
                    }
                }
                var uploadImgPromise=StoreService.uploadImg(imgUploadIP,imgArray);
                uploadImgPromise.then(function(res){
                    for(var i =0;i< $scope.files.length;i++){
                        var item= $scope.files[i];
                        console.log(item);
                        if(!isNaN(item)){
                            $scope.files[i]=res.data.path[0];
                            res.data.path.splice(0,1);
                        }else{
                            console.log($scope.files[i]);
                            $scope.files[i]=$scope.files[i].substring(ImgIp.length,$scope.files[i].length);
                        }
                    }
                    $scope.store.store_detail_img='';
                    $scope.files.forEach(function(item){
                        $scope.store.store_detail_img+=item+';';
                    })

                    cb(true,true);
                },function(err){
                    cb(true,false);
                    console.log(err);
                },function(update){
                    console.log(update);
                });

            }
            function validate (){
                var icon_legal=validation.checkNull($scope.covers,'ICON_NULL');
                var detail_legal=validation.checkNull($scope.store.store_describtion,'STORE_NULL');
                var detail_img_legal=validation.checkLength($scope.files,2,9,'DETAIL_IMG_MIN','DETAIL_IMG_MAX');
                var detail_describtion;
                var arr=[icon_legal,detail_legal,detail_img_legal,detail_describtion];
                var res=false;
                console.log(arr);
                for(var i=0;i<arr.length;i++){
                    var item=arr[i];
                    if(item){
                        res=item;
                        break;
                    }
                }
                return res;
            }
        });

    });
