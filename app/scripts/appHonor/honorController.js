/**
 * Created by wei on 16/1/12.
 */



define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('HonorCtrl', function ($scope, HonorService, $location, errMap, validation, $state, $cacheFactory) {
            $scope.params = {};
            $scope.point = [];
            $scope.count = 0;
            $scope.currentPage = 1;
            $scope.numPages = 1;
            $scope.pageSize = 10;
            $scope.pages = [];
            $scope.pageStart = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.pageEnd = $scope.pageSize;

            var load = function (params) {
                params.page = $scope.currentPage;
                params.size = $scope.pageSize;
                HonorService.getHonorList(params).then(function (data) {
                    $scope.honors = data.array;
                    $scope.count = data.counts;
                    $scope.numPages = data.counts > 0 ? Math.ceil(data.counts / $scope.pageSize) : 1;
                    $scope.pageStart = data.counts > 0 ? ($scope.currentPage - 1) * $scope.pageSize + 1 : 0;
                    $scope.pageEnd = $scope.pageSize * $scope.currentPage > data.counts ? data.counts : $scope.currentPage * $scope.pageSize;
                }, function (err) {
                    console.log(err);
                })
            }

            load($scope.params);

            $scope.getDetail = function (honorId) {
                $state.go("home.honorDetail", {honorId: honorId});
            }

            var item_index;
            $scope.del = function (index) {
                $scope.notifyContent = '确定要删除这个获奖？';
                item_index = index;
                $('#delModal').modal();
            }

            $scope.deleteHonor = function () {
                var honorId = $scope.honors[item_index].id
                HonorService.delHonor(honorId).then(function (data) {
                    $scope.honors[item_index].status = 0;
                    console.log("删除成功");
                    $('#delModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }

            $scope.judge = function (page, index) {
                if (Math.abs($scope.currentPage - page) == 5 && page != 1 && page != $scope.numPages) {
                    $scope.point[index] = true;
                } else {
                    $scope.point[index] = false;
                }

                if (Math.abs($scope.currentPage - page) <= 5 || page == $scope.numPages || page == 1) {
                    return true;
                } else {
                    return false;
                }
            }
            // 翻页
            $scope.onSelectPage = function (page) {
                $scope.currentPage = page;
                load($scope.params);
            };
            $scope.lookUp = function () {
                $scope.currentPage = 1;
                load($scope.params);
            }

        })

        controllers.controller('HonorDetailCtrl', function ($scope, HonorService, ProductService, $stateParams, errMap, $state, validation, $q) {
            $scope.files = [];
            $scope.covers = '';
            $scope.uploadImg = '';
            $scope.honorId = $stateParams.honorId;
            $scope.honor = {};

            if ($scope.honorId != 0) {
                HonorService.getHonorDetail($scope.honorId).then(function (data) {
                    console.log(data);
                    $scope.honor = data.honor;
                    $scope.product = data.product;
                    $scope.covers = $scope.honor.cover;
                    $scope.cateId = data.cateId;
                    $scope.content = data.detail;
                })
            }
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
                    $scope.honor.cover = $scope.covers;
                    if (Object.prototype.toString.call($scope.honor.cover) == "[object String]") {
                        waitDelImg.img.push($scope.honor.cover);
                        console.log('ds')
                    }
                }
            }

            $scope.save = function () {
                if (!$scope.honor.cover || $scope.honor.cover == '') {
                    $scope.notifyContent = '请上传获奖图';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.honor.title || $scope.honor.title == '') {
                    $scope.notifyContent = '请输入获奖标题';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.honor.summary || $scope.honor.summary == '') {
                    $scope.notifyContent = '请输入获奖简介';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.honor.honor_year || $scope.honor.honor_year == '') {
                    $scope.notifyContent = '请输入获奖年份';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.honor.honor_date || $scope.honor.honor_date == '') {
                    $scope.notifyContent = '请输入获奖月/日';
                    $('#notifyModal').modal();
                    return;
                }
                if ($scope.honor.r_prod<=0) {
                    $scope.notifyContent = '请输入关联作品id';
                    $('#notifyModal').modal();
                    return;
                }
                if($scope.uploadImg&&$scope.uploadImg!=''){
                    var uploadImgPromise = ProductService.uploadImg(imgUploadIP,  $scope.covers);
                    uploadImgPromise.then(function (res) {
                        console.log($scope.honor)
                        $scope.honor.cover = res.data.path;
                        if ($scope.honorId != 0) {
                            $scope.honor.id = $scope.honorId;
                            HonorService.updateHonor($scope.honor).then(function (data) {
                                console.log(data)
                                $state.go('home.honor');
                            }, function (err) {
                                alert(err);
                            })
                        } else {
                            HonorService.addHonor($scope.honor).then(function (data) {
                                console.log(data)
                                $state.go('home.honor');
                            }, function (err) {
                                alert(err);
                            })
                        }
                    }, function (err) {
                        console.log(err);
                    }, function (update) {
                        console.log(update);
                    });
                }else{
                    if ($scope.honorId != 0) {
                        $scope.honor.id = $scope.honorId;
                        HonorService.updateHonor($scope.honor).then(function (data) {
                            console.log(data)
                            $state.go('home.honor');
                        }, function (err) {
                            alert(err);
                        })
                    } else {
                        HonorService.addHonor($scope.honor).then(function (data) {
                            console.log(data)
                            $state.go('home.honor');
                        }, function (err) {
                            alert(err);
                        })
                    }
                }
            }
        });
    });
