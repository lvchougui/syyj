/**
 * Created by wei on 16/1/12.
 */



define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('CertCtrl', function ($scope, CertService, $location, errMap, validation, $state, $cacheFactory) {
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
                params.cert_code = $scope.certNum;
                CertService.getCertList(params).then(function (data) {
                    $scope.certs = data.array;
                    $scope.count = data.counts;
                    $scope.numPages = data.counts > 0 ? Math.ceil(data.counts / $scope.pageSize) : 1;
                    $scope.pageStart = data.counts > 0 ? ($scope.currentPage - 1) * $scope.pageSize + 1 : 0;
                    $scope.pageEnd = $scope.pageSize * $scope.currentPage > data.counts ? data.counts : $scope.currentPage * $scope.pageSize;
                }, function (err) {
                    console.log(err);
                })
            }

            load($scope.params);

            $scope.searchCert = function(){
                load($scope.params);
            }

            $scope.getDetail = function (certId) {
                $state.go("home.certDetail", {certId: certId});
            }

            var item_index;
            $scope.del = function (index) {
                $scope.notifyContent = '确定要删除这个证书？';
                item_index = index;
                $('#delModal').modal();
            }

            $scope.deleteCert = function () {
                var certId = $scope.certs[item_index].id
                CertService.delCert(certId).then(function (data) {
                    $scope.certs[item_index].status = 0;
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

            //$scope.selectCate = function (item) {
            //    $scope.cateId = item.id;
            //    load($scope.cateId);
            //}

        })

        controllers.controller('CertDetailCtrl', function ($scope, CertService, ProductService, $stateParams, errMap, $state, validation, $q) {
            $scope.files = [];
            $scope.covers = '';
            $scope.uploadImg = '';
            $scope.certId = $stateParams.certId;
            $scope.cert = {};

            if ($scope.certId != 0) {
                CertService.getCertDetail($scope.certId).then(function (data) {
                    console.log(data);
                    $scope.cert = data.cert;
                    $scope.product = data.product;
                    $scope.covers = $scope.cert.cover;
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
                    $scope.cert.cover = $scope.covers;
                    if (Object.prototype.toString.call($scope.cert.cover) == "[object String]") {
                        waitDelImg.img.push($scope.cert.cover);
                        console.log('ds')
                    }
                }
            }

            $scope.save = function () {
                if (!$scope.cert.cover || $scope.cert.cover == '') {
                    $scope.notifyContent = '请上传证书图';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.cert.cert_code||$scope.cert.cert_code == '') {
                    $scope.notifyContent = '请输入证书编号';
                    $('#notifyModal').modal();
                    return;
                }

                if($scope.uploadImg&&$scope.uploadImg!=''){
                    var uploadImgPromise = ProductService.uploadImg(imgUploadIP,  $scope.covers);
                    uploadImgPromise.then(function (res) {
                        console.log($scope.cert)
                        $scope.cert.cover = res.data.path;
                        if ($scope.certId != 0) {
                            $scope.cert.id = $scope.certId;
                            CertService.updateCert($scope.cert).then(function (data) {
                                console.log(data)
                                $state.go('home.cert');
                            }, function (err) {
                                alert(err);
                            })
                        } else {
                            CertService.addCert($scope.cert).then(function (data) {
                                console.log(data)
                                $state.go('home.cert');
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
                    if ($scope.certId != 0) {
                        $scope.cert.id = $scope.certId;
                        CertService.updateCert($scope.cert).then(function (data) {
                            console.log(data)
                            $state.go('home.cert');
                        }, function (err) {
                            alert(err);
                        })
                    } else {
                        CertService.addCert($scope.cert).then(function (data) {
                            console.log(data)
                            $state.go('home.cert');
                        }, function (err) {
                            alert(err);
                        })
                    }
                }
            }
        });
    });
