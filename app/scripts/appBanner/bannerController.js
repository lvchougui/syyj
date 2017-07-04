

define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('BannerCtrl', function ($scope, BannerService, validation, errMap, $state) {
            var load = function () {
                BannerService.getBannerList().then(function (data) {
                    $scope.bannerList = data;
                }, function (err) {
                    console.log(err);
                })
            }
            load();
            var item_index;
            $scope.del = function (index) {
                item_index = index;
                $('#deleteModal').modal();
            }
            $scope.delBanner = function () {
                var delJson = {
                    bannerId: $scope.bannerList[item_index].id
                }
                //console.log(delJson)
                BannerService.delBanner(delJson).then(function (data) {
                    $scope.bannerList[item_index].status = 0;
                    console.log("删除成功");
                    $('#deleteModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }
            $scope.getDetail = function (bannerId) {
                $state.go("home.addBanner", {bannerId: bannerId});
            }
        });

        controllers.controller('BannerDetailCtrl', function ($scope, BannerService,ProductService,$stateParams, validation, errMap, $state) {
            $scope.bannerId = $stateParams.bannerId;
            $scope.files = [];
            $scope.covers = '';
            $scope.uploadImg = '';
            $scope.banner = {};

            if ($scope.bannerId != 0) {
                BannerService.getBannerDetail($scope.bannerId).then(function (data) {
                    $scope.banner = data;
                    $scope.covers = data.cover;
                })
            }

            var waitDelImg = {
                icon: [],
                img: []
            };

            $scope.files = [];

            $scope.upload = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
                if ($file) {
                    $scope.covers = $file;
                    $scope.uploadImg = $file;
                    $scope.banner.cover = $scope.covers;
                    if (Object.prototype.toString.call($scope.banner.cover) == "[object String]") {
                        waitDelImg.img.push($scope.banner.cover);
                        console.log('ds')
                    }
                }
            }

            $scope.back = function () {
                history.back();
            }
            $scope.save = function(){
                if (!$scope.banner.cover || $scope.banner.cover == '') {
                    $scope.notifyContent = '请上传banner图片';
                    $('#notifyModal').modal();
                    return;
                }
                if ($scope.banner.cover_link == '') {
                    $scope.notifyContent = '请输入图片链接地址';
                    $('#notifyModal').modal();
                    return;
                }
                if($scope.uploadImg&&$scope.uploadImg!=''){
                    var uploadImgPromise = ProductService.uploadImg(imgUploadIP,  $scope.covers);
                    uploadImgPromise.then(function (res) {
                        console.log(res);
                        $scope.banner.cover = res.data.path;
                        if ($scope.bannerId != 0) {
                            $scope.banner.id = $scope.bannerId;
                            BannerService.updateBanner($scope.banner).then(function (data) {
                                //console.log(data);
                                $state.go('home.banner');
                            }, function (err) {
                                console.log(err);
                            })
                        }else{
                            BannerService.addBanner($scope.banner).then(function (data) {
                                //console.log(data);
                                $state.go('home.banner');
                            }, function (err) {
                                console.log(err);
                            })
                        }
                    }, function (err) {
                        console.log(err);
                    }, function (update) {
                        console.log(update);
                    });
                }else{
                    if ($scope.bannerId != 0) {
                        $scope.banner.id = $scope.bannerId;
                        BannerService.updateBanner($scope.banner).then(function (data) {
                            //console.log(data);
                            $state.go('home.banner');
                        }, function (err) {
                            console.log(err);
                        })
                    }else{
                        BannerService.addBanner($scope.banner).then(function (data) {
                            //console.log(data);
                            $state.go('home.banner');
                        }, function (err) {
                            console.log(err);
                        })
                    }
                }
            }
        });

    });