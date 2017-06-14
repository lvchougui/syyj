define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('PreStoreCtrl',function ($scope,StoreService,CompanyService,$stateParams,errMap,$state,validation,$q) {
            $scope.files=[];
            $scope.covers='';
            $scope.configs={
                index_img:null,
                img_href:null,
                master_desc:null
            }
            console.log('===========');
            var load = function () {
                console.log('======1111=====');
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
                    $scope.configs.index_img = $scope.covers;
                    if (Object.prototype.toString.call($scope.configs.index_img) == "[object String]") {
                        waitDelImg.img.push($scope.configs.index_img);
                        console.log('ds')
                    }
                }
            }

            $scope.save = function () {
                $("button").attr("disabled", "disabled");  //将所有button的disable属性值设置为disable

                if ($scope.configs.img_href == 0) {
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

                var uploadImgPromise = CompanyService.uploadImg(imgUploadIP,  $scope.configs.index_img);
                uploadImgPromise.then(function (res) {
                    console.log(res);
                    $scope.configs.index_img = res.data.path;
                }, function (err) {
                    console.log(err);
                }, function (update) {
                    console.log(update);
                });

                //uploadImgPromise.then(function (data) {
                //    console.log($scope.configs);
                //    StoreService.updateConfig($scope.configs).then(function (data) {
                //        console.log(data);
                //    }, function (err) {
                //        console.log(err);
                //    })
                //}, function (err) {
                //
                //})
            }
        });
    });
