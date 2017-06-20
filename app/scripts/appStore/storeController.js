define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('PreStoreCtrl',function ($scope,StoreService,ProductService,$stateParams,errMap,$state,validation,$q) {
            $scope.files=[];
            $scope.covers='';
            $scope.uploadImg='';
            $scope.configs={
                index_img:null,
                img_href:null,
                master_desc:null
            }
            var load = function () {
                StoreService.getConfig().then(function(data){
                    console.log(data.result[0]);
                    if(data.length!=0){
                        $scope.configs=data.result[0];
                        if( $scope.configs.index_img!=null){
                            $scope.covers= $scope.configs.index_img;
                        }

                    }
                },function(err){
                    console.log(err);
                })
            }
            load();


            var waitDelImg = {
                icon: [],
                img: []
            };

            $scope.files = [];

            $scope.upload = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
                console.log($file)
                if ($file) {
                    $scope.covers = $file;
                    $scope.uploadImg = $file;
                    $scope.configs.index_img = $scope.covers;
                    if (Object.prototype.toString.call($scope.configs.index_img) == "[object String]") {
                        waitDelImg.img.push($scope.configs.index_img);
                        console.log('ds')
                    }
                }
            }

            $scope.save = function () {
                $("button").attr("disabled", "disabled");  //将所有button的disable属性值设置为disable

                if (!$scope.configs.img_href||$scope.configs.img_href=='') {
                    alert('请填写首页大图链接');
                    return;
                }
                if ($scope.configs.master_desc == '') {
                    alert('请填写大师简介');
                    return;
                }
                    addSave();
            }

            function addSave() {
                console.log('保存图片');

                if($scope.uploadImg&&$scope.uploadImg!=''){
                    var uploadImgPromise = ProductService.uploadImg(imgUploadIP,  $scope.covers);
                    uploadImgPromise.then(function (res) {
                        console.log(res);
                        $scope.configs.index_img = res.data.path;
                        StoreService.updateConfig($scope.configs).then(function (data) {
                            console.log(data);
                            if(data.result==200){
                                alert("修改成功");
                            }
                        }, function (err) {
                            console.log(err);
                        })
                    }, function (err) {
                        console.log(err);
                    }, function (update) {
                        console.log(update);
                    });
                }else{
                    StoreService.updateConfig($scope.configs).then(function (data) {
                        console.log(data);
                        if(data.result==200){
                            alert("修改成功");
                        }
                    }, function (err) {
                        console.log(err);
                    })
                }

            }
        });
    });
