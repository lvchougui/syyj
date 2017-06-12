/**
 * Created by younong-3 on 2016/4/12.
 */
/**
 * Created by wei on 16/1/12.
 */



define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('PinCtrl', function ($scope, PinService, validation, errMap, $state) {
            $scope.localImageIp = localImageIp
            $scope.tuanStatue = [
                {activity_status: '0', tuan_status_name: '所有拼团', select: true},
                {
                    activity_status: '2',
                    tuan_status_name: '未开始',
                    select: false
                },
                {
                    activity_status: '1',
                    tuan_status_name: '进行中',
                    select: false
                },
                {activity_status: '3', tuan_status_name: '已结束', select: false},
                {activity_status: '4', tuan_status_name: '已失效', select: false}
            ];
            var errMap = errMap.getMap();
            $scope.conditionParams = {
                activity_status: '',
                activity_name: ''
            }
            $scope.params = {
                activity_status: 0,
                page: 1,
                size: 10
            };
            $scope.point = [];
            $scope.count = 0;
            $scope.currentPage = 1;
            $scope.numPages = 1;
            $scope.pageSize = 10;
            $scope.pages = [];
            $scope.pageStart = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.pageEnd = $scope.pageSize;
            $scope.conditionParams.activity_status = $scope.params.activity_status;
            $scope.flag = true;//用于解决弹框重复出现

            var load = function (params) {
                params.page = $scope.currentPage;
                params.size = $scope.pageSize;
                PinService.getTuan(params).then(function (data) {
                    $scope.tuans = data.data;
                    if ($scope.tuans.length > 0) {
                        $scope.tuans.forEach(function (item) {
                            if (item.activity_status == 1) {
                                item.activity_status_display = "正在进行";
                            } else if (item.activity_status == 2) {
                                item.activity_status_display = "未开始";
                            } else if (item.activity_status == 3) {
                                item.activity_status_display = "已经结束";
                            } else if (item.activity_status == 4) {
                                item.activity_status_display = "已失效";
                            }
                        });
                        $scope.count = data.counts;
                        $scope.numPages = data.counts > 0 ? Math.ceil(data.counts / $scope.pageSize) : 1;
                        $scope.pageStart = data.counts > 0 ? ($scope.currentPage - 1) * $scope.pageSize + 1 : 0;
                        $scope.pageEnd = $scope.pageSize * $scope.currentPage > data.counts ? data.counts : $scope.currentPage * $scope.pageSize;
                    }
                    else {
                        $scope.count = 0;
                        $scope.numPages = 1;
                        $scope.pageStart = 0;
                        $scope.pageEnd = 0;
                    }

                }, function (err) {
                    console.log(err);
                })
            }
            load($scope.params);
            $scope.onSelectPage = function (page) {

                $scope.currentPage = page;
                load($scope.params);
            };

            $scope.lookUp = function () {

                $scope.currentPage = 1;
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
            $scope.loadByCondition = function () {
                $scope.activity_name = '';
                $scope.currentPage = 1;
                $scope.params = $.extend($scope.params, $scope.conditionParams);
                console.log($scope.params);

                load($scope.params);
            }
            $scope.loadByName = function () {
                $scope.currentPage = 1;
                load({activity_status: 0, page: 1, size: 10, activity_name: $scope.activity_name});
            }

            var item_index;
            $scope.del = function (index) {
                item_index = index;
                $('#deleteModal').modal();
            }

            $scope.stopPin = function (index) {
                item_index = index;
                $('#stopModal').modal();
            }

            $scope.deletePintuan = function () {
                var delJson = {
                    activity_id: $scope.tuans[item_index].id
                }
                PinService.delPinActivity(delJson).then(function (data) {
                    $scope.tuans[item_index].status = 0;
                    $('#deleteModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }

            $scope.stopPintuan = function () {
                var stopJson = {
                    activity_id: $scope.tuans[item_index].id
                }
                PinService.remPinActivity(stopJson).then(function (data) {
                    $scope.tuans[item_index].activity_status = 4;
                    $('#stopModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }

            $scope.stop = function (index) {

            }

            $scope.editor = function (sku) {

                if (sku.company_goods_sku_audit == 2) {
                    $scope.activity_temp = [];
                    for (var i = 1; i < $scope.activity_type_all.length; i++) {
                        $scope.activity_temp[i - 1] = $scope.activity_type_all[i];
                    }
                    console.log($scope.activity_temp);
                }
                $scope.sku_item = sku;
                $scope.sku_item.discount_rate = $scope.sku_item.discount_rate / 1000;
                $scope.sku_item.discount_save_rate = $scope.sku_item.discount_save_rate / 1000;
                if (sku.company_goods_sku_buy_number == 0) {
                    $scope.sku_item.limit_buy = '否'
                }
                else {
                    $scope.sku_item.limit_buy = '是'
                }
                if (!sku.company_goods_sku_activity_id) {
                    $scope.sku_item.company_goods_sku_activity_id = 0
                }
                if ($scope.sku_item.company_goods_sku_type == 3) {
                    PinService.getGoodsByCompanyGoodsStatue().then(function (data) {
                        console.log(data);
                        $scope.goodsCollection = data.result;
                        $scope.getCompanySkuItem($scope.sku_item.giftSkuArray[0].company_goods_id);
                    }, function (err) {
                        console.log(err);
                    });
                }
                $('#editorModal').modal();

            }

            $scope.selectStatue = function (item) {
                $scope.conditionParams.activity_status = item.activity_status;
                $scope.tuanStatue.forEach(function (data) {
                    data.select = false;
                })
                item.select = true;
                $scope.currentPage = 1;
                $scope.params = $.extend($scope.params, $scope.conditionParams);
                load($scope.params);
            }

            $scope.getDetail = function (activity_id) {
                $state.go("home.wholesaleDetail", {activity_id: activity_id});
            }

        });
        controllers.controller('PinDetailCtrl', function ($scope, PinService, CompanyService, $stateParams, errMap, $state, validation, $q) {
            $('#pinStart').datetimepicker({language: 'zh-CN', autoclose: true});
            $('#pinEnd').datetimepicker({language: 'zh-CN', autoclose: true});
            $scope.localImageIp = localImageIp;
            /*var cancelPil = function () {
             if (this && this.stopPropagation) {
             console.log("取消冒泡！！");
             //W3C取消冒泡事件
             this.stopPropagation();
             } else {
             console.log("取消冒泡！！");
             //IE取消冒泡事件
             window.event.cancelBubble = true;
             }
             }*/

            $scope.activity_id = $stateParams.activity_id;
            $scope.conditionParams = {
                company_goods_status_id: 2,
                company_goods_name: ''
            }
            $scope.params = {company_goods_status_id: 2, page: 1, size: 10};
            $scope.point = [];
            $scope.count = 0;
            $scope.currentPage = 1;
            $scope.numPages = 1;
            $scope.pageSize = 5;
            $scope.pages = [];
            $scope.pageStart = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.pageEnd = $scope.pageSize;

            $scope.batchPrice = 0;
            $scope.activity = {
                id: 0,
                activity_name: '',
                product_id: 0,
                is_simulate: 1,
                is_head_discount: 0,
                head_discount: 0,
                activity_start_time: '',
                activity_end_time: '',
                activity_status: 0,
                activity_img: '',
                activity_cover:'',
                norms: [
                    //{
                    //    activity_good_id: 0,
                    //    product_id: 0,
                    //    sku_id: 0,
                    //    sku_norms: '',
                    //    status: 1,
                    //    old_price: 0,
                    //    activity_price: 0,
                    //    buyer_number: 0,
                    //}
                ],
                sku_norms: [
                    //{
                    //    company_goods_norms: '',
                    //    company_goods_sku_id: '',
                    //    company_goods_sale_price: ''
                    //}
                ]
            }

            $scope.discountArr = [
                {
                    discountName: '9.5折',
                    discount: 95
                },
                {
                    discountName: '9折',
                    discount: 90
                },
                {
                    discountName: '8.5折',
                    discount: 85
                },
                {
                    discountName: '8折',
                    discount: 80
                },
                {
                    discountName: '7.5折',
                    discount: 75
                },
                {
                    discountName: '7折',
                    discount: 70
                },
            ]

            $scope.selectDiscount = function (index) {
                $scope.activity.head_discount = $scope.discount.discount;
            }

            $scope.addNorm = function () {
                if ($scope.activity.product_id == 0) {
                    alert("请选择商品后再进行此操作！");
                    return;
                }
                $scope.activity.norms.push({
                    activity_good_id: 0,
                    product_id: $scope.activity.product_id,
                    sku_id: 0,
                    sku_norms: '',
                    status: 1,
                    old_price: 0,
                    activity_price: 0,
                    buyer_number: 0,
                });
            }
            $scope.selectNorm = [];
            $scope.selNorm = function (index) {
                $scope.activity.norms[index].sku_id = $scope.selectNorm[index].company_goods_sku_id;
                $scope.activity.norms[index].sku_norms = $scope.selectNorm[index].company_goods_norms;
                $scope.activity.norms[index].old_price = $scope.selectNorm[index].company_goods_sale_price;
                console.log($scope.activity.norms[index]);
            }

            var item_index;
            $scope.delNorm = function (index) {
                item_index = index;
                $('#deleteModal').modal();
            }

            $scope.deleteNorm = function () {
                $scope.activity.norms[item_index].status = 0;
                //$scope.activity.norms.splice(item_index, 1);
                $('#deleteModal').modal('hide');
            }

            $scope.setBatchPrice = function () {
                if ($scope.activity.norms.length == 0) {
                    alert('请先设置团购规格！');
                    return;
                }
                $scope.activity.norms.forEach(function (item) {
                    item.activity_price = $scope.batchPrice;
                });
            }

            $scope.isSimulateSelected = function () {
                if ($scope.activity.is_simulate == 1) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.updateSimulateSelection = function () {
                if ($scope.activity.is_simulate == 1) {
                    $scope.activity.is_simulate = 0;
                } else {
                    $scope.activity.is_simulate = 1;
                }
            }

            $scope.isDiscountSelected = function () {
                if ($scope.activity.is_head_discount == 1) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.updateDiscountSelection = function () {
                if ($scope.activity.is_head_discount == 1) {
                    $scope.activity.is_head_discount = 0;
                } else {
                    $scope.activity.is_head_discount = 1;
                }
            }

            if ($stateParams.activity_id != 0) {
                PinService.getActivityDetail({activity_id: $stateParams.activity_id}).then(function (data) {
                    console.log(data);
                    $scope.activity = data;
                    if (data.activity_img.indexOf('http') == -1) {
                        $scope.activity.activity_img = IconIp + data.activity_img;
                    }

                    if (data.activity_cover && data.activity_cover.indexOf('http') == -1) {
                        $scope.activity.activity_cover = IconIp + data.activity_cover;
                    }
                    $scope.covers = $scope.activity.activity_cover;

                    if ($scope.activity.head_discount == 95) {
                        $scope.discount = $scope.discountArr[0];
                    } else if ($scope.activity.head_discount == 90) {
                        $scope.discount = $scope.discountArr[1];
                    } else if ($scope.activity.head_discount == 85) {
                        $scope.discount = $scope.discountArr[2];
                    } else if ($scope.activity.head_discount == 80) {
                        $scope.discount = $scope.discountArr[3];
                    } else if ($scope.activity.head_discount == 75) {
                        $scope.discount = $scope.discountArr[4];
                    } else if ($scope.activity.head_discount == 70) {
                        $scope.discount = $scope.discountArr[5];
                    }
                }, function (err) {
                    console.log(err);
                })
            }

            $scope.selectProduct = function () {
                $scope.currentPage = 1;
                $scope.params = $.extend($scope.params, $scope.conditionParams);
                loadProducts($scope.params);
                $('#selectProductModel').modal();
            }
            Date.prototype.Format = function (fmt) { //author: meizz
                var o = {
                    "M+": this.getMonth() + 1,                 //月份
                    "d+": this.getDate(),                    //日
                    "h+": this.getHours(),                   //小时
                    "m+": this.getMinutes(),                 //分
                    "s+": this.getSeconds(),                 //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds()             //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
            var loadProducts = function (params) {
                params.page = $scope.currentPage;
                params.size = $scope.pageSize;
                CompanyService.getCompanyGoods(params).then(function (data) {
                    $scope.goods = data.array;
                    $scope.goods.forEach(function (item) {
                        item.company_goods_icon = IconIp + item.company_goods_icon;
                        item.add_date = (new Date(item.add_date)).Format("yyyy-MM-dd hh:mm:ss");
                    })
                    $scope.count = data.counts;
                    $scope.numPages = data.counts > 0 ? Math.ceil(data.counts / $scope.pageSize) : 1;
                    $scope.pageStart = data.counts > 0 ? ($scope.currentPage - 1) * $scope.pageSize + 1 : 0;
                    $scope.pageEnd = $scope.pageSize * $scope.currentPage > data.counts ? data.counts : $scope.currentPage * $scope.pageSize;
                }, function (err) {
                    console.log(err);
                })
            }

            $scope.loadByGoodsName = function () {
                $scope.currentPage = 1;
                loadProducts({
                    company_goods_status_id: 2,
                    page: 1,
                    size: 6,
                    company_goods_name: $scope.search_goods_name
                });
            }

            $scope.onSelectPage = function (page) {
                $scope.currentPage = page;
                loadProducts($scope.params);
            };
            $scope.lookUp = function () {
                $scope.currentPage = 1;
                loadProducts($scope.params);
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
            $scope.loadByCondition = function () {
                $scope.company_goods_name = '';
                $scope.currentPage = 1;
                $scope.params = $.extend($scope.params, $scope.conditionParams);
                loadProducts($scope.params);
            }

            $scope.selectThis = function (good) {
                $scope.good = good;
                $scope.activity.activity_img = good.company_goods_icon;
                $scope.activity.product_id = good.company_goods_id;
                console.log($scope.good);
                if ($scope.good.skuArr.length != 0) {
                    $scope.activity.sku_norms = [];
                    $scope.good.skuArr.forEach(function (item) {
                        $scope.activity.sku_norms.push({
                            company_goods_norms: item.company_goods_norms,
                            company_goods_sku_id: item.company_goods_sku_id,
                            company_goods_sale_price: item.company_goods_sale_price
                        })
                    });
                }
                $('#selectProductModel').modal('hide');
            }

            $scope.back = function () {
                history.back();
            }

            $scope.save = function () {
                $("button").attr("disabled", "disabled");  //将所有button的disable属性值设置为disable

                if ($scope.activity.product_id == 0) {
                    alert('请选择团购商品');
                    return;
                }
                if ($scope.activity.activity_name == '') {
                    alert('请填写团购活动名称');
                    return;
                }
                if ($('#pinStart').val() == '' || $('#pinStart').val() == null) {
                    alert('请选择团购开始时间');
                    return;
                }
                if ($('#pinEnd').val() == '' || $('#pinEnd').val() == null) {
                    alert('请选择团购结束时间');
                    return;
                }
                if ($scope.activity.norms.length == 0) {
                    alert('请填写团购规则');
                    return;
                }
                $scope.activity.activity_start_time = $('#pinStart').val();
                $scope.activity.activity_end_time = $('#pinEnd').val();


                var arr = [$scope.covers];
                console.log(arr[0]);
                if ($scope.covers) {
                    var iconResize = CompanyService.resize(arr, null, null, 0.5, '2:1');
                    iconResize.then(function (data) {
                        $scope.activity.activity_cover = arr[0];
                        console.log($scope.activity.activity_cover);
                    }, function (err) {
                        console.log(err);
                    })
                }

                var imgResize = CompanyService.resize($scope.files, null, null, 0.5, null);
                imgResize.then(function (data) {
                }, function (err) {
                    console.log(err)
                });
                var promiseResizeAll = $q.all([imgResize, iconResize]);
                promiseResizeAll.then(function (data) {
                    addSave();
                });

            }

            function addSave() {
                console.log('保存图片');
                console.log($scope.files);

                $scope.files.splice($scope.files.length - 1, 1);
                var uploadImgPromise = CompanyService.uploadImg(imgUploadIP, $scope.files);
                uploadImgPromise.then(function (res) {
                    $scope.activity.activity_cover = '';
                    res.data.path.forEach(function (item) {
                        $scope.activity.activity_cover += item + ';';
                    })
                }, function (err) {
                    console.log(err);
                }, function (update) {
                    console.log(update);
                });
                var uploadIconPromise = CompanyService.uploadImg(iconUploadIP, $scope.activity.activity_cover);
                uploadIconPromise.then(function (res) {
                    $scope.activity.activity_cover = res.data.path;
                }, function (err) {
                    console.log(err);
                }, function (update) {
                    console.log(update);
                });

                var promiseUploadAll = $q.all([uploadImgPromise, uploadIconPromise]);
                promiseUploadAll.then(function (data) {
                    console.log($scope.activity);
                    if ($scope.activity.id == 0) {
                        PinService.addActivity($scope.activity).then(function (data) {
                            console.log(data);
                            $state.go('home.wholesale');
                        }, function (err) {
                            console.log(err);
                        })
                    } else {
                        PinService.updateActivity($scope.activity).then(function (data) {
                            console.log(data);
                            $state.go('home.wholesale');
                        }, function (err) {
                            console.log(err);
                        })
                    }

                }, function (err) {

                })
            }

            $scope.hideAll = function () {   //点击空白处下拉框消失，需要在其他区域取消冒泡

                $scope.china.forEach(function (item) {
                    item.province.forEach(function (province) {
                        province.myStyle = {
                            "background-color": "#ffffff"
                        }
                        province.visible = false;
                    })
                })
            }

            var waitDelImg = {
                icon: [],
                img: []
            };
            //存放商品图片
            $scope.files = [];

            $scope.uploadDetail = function ($files, $file) {
                $scope.files = $files;
            }

            $scope.upload = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
                console.log("$file===>");
                console.log($file);
                console.log("$files===>");
                console.log($files);
                if ($file) {
                    $scope.covers = $file;
                    if (Object.prototype.toString.call($scope.activity.activity_cover) == "[object String]") {
                        waitDelImg.icon.push($scope.activity.activity_cover);
                        console.log('ds')
                    }
                }
            }

            $scope.drop = function (index) {
                if (Object.prototype.toString.call($scope.files[index]) == "[object String]") {
                    waitDelImg.img.push(imgArray[index]);
                }
                $scope.files.splice(index, 1);
            }

            $scope.replace = function ($file, index) {
                console.log(index);
                if (Object.prototype.toString.call($scope.files[index]) == "[object String]") {
                    waitDelImg.img.push(imgArray[index]);
                }
                $scope.files[index] = $file;
            }
        });
    });
