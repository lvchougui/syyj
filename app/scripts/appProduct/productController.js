define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('ProductListCtrl', function ($scope, ProductService, $location, errMap, validation, $state) {
            $scope.params = {};
            $scope.point = [];
            $scope.count = 0;
            $scope.currentPage = 1;
            $scope.numPages = 1;
            $scope.pageSize = 10;
            $scope.pages = [];
            $scope.pageStart = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.pageEnd = $scope.pageSize;

            $scope.cates = [];
            var load = function (params) {
                params.page = $scope.currentPage;
                params.size = $scope.pageSize;
                params.name = $scope.product_key;
                ProductService.getProductList(params).then(function (data) {
                    $scope.products = data.array;
                    $scope.count = data.counts;
                    $scope.numPages = data.counts > 0 ? Math.ceil(data.counts / $scope.pageSize) : 1;
                    $scope.pageStart = data.counts > 0 ? ($scope.currentPage - 1) * $scope.pageSize + 1 : 0;
                    $scope.pageEnd = $scope.pageSize * $scope.currentPage > data.counts ? data.counts : $scope.currentPage * $scope.pageSize;
                }, function (err) {
                    console.log(err);
                })
            }
            ProductService.getCateList().then(function (data) {
                $scope.cates = data;
                if (data && data.length > 0) {
                    $scope.cateId = data[0].id;
                    $scope.params.cateId = data[0].id;
                    load($scope.params);
                }
            }, function (err) {
                console.log(err);
            })

            $scope.searchProduct = function () {
                load($scope.params);
            }

            $scope.getDetail = function (productId) {
                $state.go("home.productDetail", {productId: productId});
            }

            var item_index;
            $scope.del = function (index) {
                $scope.notifyContent = '确定要删除这件作品？';
                item_index = index;
                $('#delModal').modal();
            }

            $scope.sold = function (index) {
                $scope.notifyContent = '确定这件作品已售出？';
                item_index = index;
                $('#soldModal').modal();
            }

            $scope.soldOut = function (index) {
                $scope.notifyContent = '确定要删除这件作品？';
                var productId = $scope.products[item_index].id
                ProductService.soldProduct(productId).then(function (data) {
                    $scope.products[item_index].is_sold = 1;
                    console.log("操作成功");
                    $('#soldModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }

            $scope.deleteProduct = function () {
                var productId = $scope.products[item_index].id

                //console.log(delJson)
                ProductService.delProduct(productId).then(function (data) {
                    $scope.products[item_index].status = 0;
                    console.log("删除成功");
                    $('#delModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }

            $scope.selectCate = function (item) {
                $scope.cateId = item.id;
                $scope.params.cateId = item.id;
                load($scope.params);
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

        controllers.controller('ProductDetailCtrl', function ($scope, ProductService, $stateParams, errMap, $state, validation, $q) {
            $scope.files = [];
            $scope.covers = '';
            $scope.uploadImg = '';

            $scope.productId = $stateParams.productId;
            $scope.product = {};

            $scope.displayStatus = [{id: 0, name: '不显示'}, {id: 1, name: '显示'}];
            $scope.soldStatus = [{id: 0, name: '未售'}, {id: 1, name: '已售'}];

            ProductService.getCateList().then(function (data) {
                $scope.cates = data;
                if ($scope.productId != 0) {
                    ProductService.getProductDetail($scope.productId).then(function (data) {
                        $scope.product = data;
                        $scope.cateId = data.cateId;
                        $scope.content = data.detail;
                        $scope.soldType = data.is_sold;
                        $scope.displayType = data.p_display;
                        $scope.covers = data.cover;
                    })
                } else {
                    $scope.cateId = data[0].id;
                    $scope.product.cateId = data[0].id;
                    $scope.soldType = 0;
                    $scope.displayType = 1;
                    $scope.product.is_sold = 0;
                }
            }, function (err) {
                console.log(err);
            })

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
                    $scope.product.cover = $scope.covers;
                    if (Object.prototype.toString.call($scope.product.cover) == "[object String]") {
                        waitDelImg.img.push($scope.cert.cover);
                        console.log('ds')
                    }
                }
            }


            $scope.selectSold = function (item) {
                $scope.soldType = item.id;
                $scope.product.is_sold = item.id;
            }
            $scope.selectDisplay = function (item) {
                $scope.displayType = item.id;
                $scope.product.p_display = item.id;
            }

            $scope.selectCate = function (item) {
                $scope.cateId = item.id;
                $scope.product.cateId = item.id;
            }

            $scope.save = function () {
                if (!$scope.product.cover || $scope.product.cover == '') {
                    $scope.notifyContent = '请上传作品首图';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.product.p_code || $scope.product.p_code == '') {
                    $scope.notifyContent = '请输入作品编号';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.product.name || $scope.product.name == '') {
                    $scope.notifyContent = '请输入作品名称';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.product.p_style || $scope.product.p_style == '') {
                    $scope.notifyContent = '请输入作品题材';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.product.summary || $scope.product.summary == '') {
                    $scope.notifyContent = '请输入作品简介';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.product.p_material || $scope.product.p_material == '') {
                    $scope.notifyContent = '请输入作品材质';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.product.p_size || $scope.product.p_size == '') {
                    $scope.notifyContent = '请输入作品尺寸';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.product.p_weight || $scope.product.p_weight == '') {
                    $scope.notifyContent = '请输入作品重量';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.content || $scope.content.length == 0) {
                    $scope.notifyContent = '请输入作品详情';
                    $('#notifyModal').modal();
                } else {
                    $scope.product.detail = $scope.content;

                    if ($scope.uploadImg && $scope.uploadImg != '') {
                        var uploadImgPromise = ProductService.uploadImg(imgUploadIP, $scope.covers);
                        uploadImgPromise.then(function (res) {
                            $scope.product.cover = res.data.path;
                            if ($scope.productId != 0) {
                                $scope.product.id = $scope.productId;
                                ProductService.updateProduct($scope.product).then(function (data) {
                                    console.log(data)
                                    $state.go('home.productList');
                                }, function (err) {
                                    alert(err);
                                })
                            } else {
                                ProductService.addProduct($scope.product).then(function (data) {
                                    console.log(data)
                                    $state.go('home.productList');
                                }, function (err) {
                                    alert(err);
                                })
                            }
                        }, function (err) {
                            console.log(err);
                        }, function (update) {
                            console.log(update);
                        });
                    } else {
                        if ($scope.productId != 0) {
                            $scope.product.id = $scope.productId;
                            ProductService.updateProduct($scope.product).then(function (data) {
                                console.log(data)
                                $state.go('home.productList');
                            }, function (err) {
                                alert(err);
                            })
                        } else {
                            ProductService.addProduct($scope.product).then(function (data) {
                                console.log(data)
                                $state.go('home.productList');
                            }, function (err) {
                                alert(err);
                            })
                        }
                    }
                }
            }
        });

    });
