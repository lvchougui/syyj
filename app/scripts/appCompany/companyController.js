/**
 * Created by wei on 16/1/12.
 */



define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('CompanyGoodsCtrl', function ($scope, CompanyService, $location, errMap, validation, $state, $cacheFactory) {

            $scope.orderStatue = [{
                company_goods_status_id: '0',
                company_goods_status_name: '全部',
                select: true
            }, {company_goods_status_id: '10', company_goods_status_name: '暂存', select: false},
                {
                    company_goods_status_id: '1,9',
                    company_goods_status_name: '审核中',
                    select: false
                }, {company_goods_status_id: '8', company_goods_status_name: '审核失败', select: false},
                {
                    company_goods_status_id: '2',
                    company_goods_status_name: '已上架',
                    select: false
                }, {company_goods_status_id: '3,5,6', company_goods_status_name: '已下架', select: false}];
            $('#dpStart, #dpEnd').datepicker({});
            $scope.conditionParams = {
                dateStart: '',
                dateEnd: '',
                company_goods_status_id: '',
                company_goods_name: ''
            }
            //是否显示更新提示框
            if (!localStorage.oneKeySend || localStorage.oneKeySend == 'false') {
                console.log('dsds')
                $('#updateInformation').modal();
            }
            var errMap = errMap.getMap();
            $scope.updateFlag = false;
            $scope.chgFlag = function () {
                localStorage.oneKeySend = $scope.updateFlag
                console.log(localStorage.oneKeySend)
            }

            $scope.params = {company_goods_status_id: 0, page: 1, size: 10};
            $scope.point = [];
            $scope.count = 0;
            $scope.currentPage = 1;
            $scope.numPages = 1;
            $scope.pageSize = 10;
            $scope.pages = [];
            $scope.pageStart = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.pageEnd = $scope.pageSize;
            $scope.conditionParams.company_goods_status_id = $scope.params.company_goods_status_id;
            $scope.company_type = localStorage.company_type;
            $scope.sku = [{
                company_goods_left_quantity: 0,
                company_goods_norms: "",
                company_goods_price: 0,
                company_goods_sale_quantity: 0,
                company_goods_sku_id: null,
                init_quantity: 0,
                status: 1,
                unit: '',
                norms: '',
                frequency: 1,
                lowest_price: 0,
//HEAD
                //in_price:0
                /*}];
                 var cache=CompanyService.getCache();*/
//
                in_price: 0,
                deliveryTemplateId: ''
            }]

            var cache = CompanyService.getCache();
            $scope.deliveryTemplate = '';
            var getAllDeliveryTemplate = function () {
                CompanyService.getAllDeliveryTemplate().then(function (data) {
                    $scope.deliveryTemplate = data[0];
                    $scope.deliveryTemplates = data;
                }, function (err) {
                    console.log(err);
                })
            }
            getAllDeliveryTemplate();
//yunfei
            var load = function (params) {
                params.page = $scope.currentPage;
                params.size = $scope.pageSize;
                CompanyService.getCompanyGoods(params).then(function (data) {
                    $scope.goods = data.array;
                    $scope.goods.forEach(function (item) {
                        item.company_goods_icon = IconIp + item.company_goods_icon;
                        if (item.company_goods_send == 0) {
                            item.company_goods_send = '否';
                        } else {
                            item.company_goods_send = '是';
                        }
                        if (item.company_goods_fresh == 0) {
                            item.company_goods_fresh = '库存驱动';
                        } else {
                            item.company_goods_fresh = '订单驱动';
                        }
                    })
                    $scope.count = data.counts;
                    $scope.numPages = data.counts > 0 ? Math.ceil(data.counts / $scope.pageSize) : 1;
                    $scope.pageStart = data.counts > 0 ? ($scope.currentPage - 1) * $scope.pageSize + 1 : 0;
                    $scope.pageEnd = $scope.pageSize * $scope.currentPage > data.counts ? data.counts : $scope.currentPage * $scope.pageSize;
                }, function (err) {
                    console.log(err);
                })
            }
            CompanyService.getGoodsStatue().then(function (res) {
                res.result.unshift({
                    company_goods_status_id: 0,
                    company_goods_status_name: '全部'
                })
                $scope.goodsStatusOptions = res.result;
            }, function (err) {
                console.log(err);
            })
            if (cache.info().size > 0) {
                $scope.goods = cache.get('goods')
                $scope.orderStatue = cache.get('orderStatue');
                $scope.currentPage = cache.get('currentPage');
                $scope.count = cache.get('count');
                $scope.pageStart = cache.get('pageStart');
                $scope.pageEnd = cache.get('pageEnd');
                $scope.numPages = cache.get('numPages')
            } else {
                load($scope.params);
            }
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
                $scope.company_goods_name = '';
                $scope.currentPage = 1;
                $scope.conditionParams.dateStart = $("#dpStart").val();
                $scope.conditionParams.dateEnd = $("#dpEnd").val();
                $scope.params = $.extend($scope.params, $scope.conditionParams);
                console.log($scope.params);

                load($scope.params);
            }
            $scope.getDetail = function (company_goods_id) {
                cache.put('goods', $scope.goods);
                cache.put('orderStatue', $scope.orderStatue);
                cache.put('currentPage', $scope.currentPage);
                cache.put('count', $scope.count);
                cache.put('pageStart', $scope.pageStart);
                cache.put('pageEnd', $scope.pageEnd);
                cache.put('numPages', $scope.numPages)
                $state.go("home.companyGoodsDetail", {goods_id: company_goods_id});
            }
            $scope.loadByGoodsName = function () {
                $scope.currentPage = 1;
                load({company_goods_status_id: 0, page: 1, size: 10, company_goods_name: $scope.company_goods_name});
            }

            var item_id;
            $scope.del = function (index) {
                $scope.notifyContent = '确定要删除？';
                item_id = index;
                $('#delModal').modal();
            }

            $scope.editor = function (index) {
                $scope.flag = false;
                item_id = index;
                $scope.selectedGood = $scope.goods[item_id];
                $scope.goods[item_id].skuArr.forEach(function (item) {
                    if (item.company_goods_sku_type != 0) {
                        $scope.flag = true;
                    }
                })
                $scope.sku = $scope.goods[item_id].skuArr;
                $('#editorModal').modal();
            }

            var chgValidate = function () {
                var sku_price_legal;
                var sku_quantity_legal;
                var sku_init_quantity_legal;
                var sku_frequency_legal;
                var qualityHgInit;
                var lowest_legal;
                var PriceHgLowestPrice_legal;
                $scope.selectedGood.skuArr.forEach(function (item) {
                    var price_legal = validation.checkPrice(item.company_goods_price, 'PRICE_ERROE');
                    console.log(localStorage.company_type == '0');
                    console.log(localStorage.company_type == '1');
                    if (localStorage.company_type == '0') {

                        var lowest_item_legal = validation.checkPrice(item.lowest_price, 'PRICE_ERROE');
                        var PriceHgLowestPrice_item_legal = validation.checkSalePriceHgLowestPrice(item.company_goods_price, item.lowest_price);
                    }
                    else {
                        var lowest_item_legal = validation.checkPrice(item.in_price, 'PRICE_ERROE');
                        var PriceHgLowestPrice_item_legal = validation.checkSalePriceHgLowestPrice(item.company_goods_price, item.in_price);
                    }
                    var quantity_legal = validation.checkNumber(item.company_goods_left_quantity, 'QUANTITY_ERROR');
                    var init_quantity_legal = validation.checkNumber(item.init_quantity, 'INIT_QUANTITY_ERROR');
                    var frequency_legal = validation.checkNumber(item.frequency, 'FREQUENCY_ERROR');
                    var quality_hg_init_legal = validation.checkQuality(item.company_goods_left_quantity, item.init_quantity);
                    if (price_legal) {
                        sku_price_legal = price_legal;
                    }
                    if (quantity_legal) {
                        sku_quantity_legal = quantity_legal;
                    }
                    if (init_quantity_legal) {
                        sku_init_quantity_legal = init_quantity_legal;
                    }
                    if (frequency_legal) {
                        sku_frequency_legal = frequency_legal;
                    }
                    if (quality_hg_init_legal) {
                        qualityHgInit = quality_hg_init_legal;
                    }
                    if (lowest_item_legal) {
                        lowest_legal = lowest_item_legal;
                    }
                    if (PriceHgLowestPrice_item_legal) {
                        PriceHgLowestPrice_legal = PriceHgLowestPrice_item_legal;
                    }
                });
                var arr = [sku_price_legal, sku_quantity_legal, sku_init_quantity_legal, sku_frequency_legal, qualityHgInit, lowest_legal, PriceHgLowestPrice_legal];
                var res = false;
                for (var i = 0; i < arr.length; i++) {
                    res = arr[i];
                    if (arr[i]) {
                        break;
                    }
                }
                return res;
            }
            $scope.chgQuantity = function () {
                var res = chgValidate();
                if (res) {
                    alert(errMap[res])
                }
                else {
                    $scope.sku.forEach(function (item) {
                        if (!item.company_goods_left_quantity)item.company_goods_left_quantity = 0;
                        if (!item.company_goods_price)item.company_goods_price = 0;
                        if (!item.init_quantity)item.init_quantity = 0;
                        if (!item.frequency)item.frequency = 1;
                        if (!item.lowest_price)item.lowest_price = 0;
                        if (!item.in_price)item.in_price = 0;
                        if (!item.pre_price)item.pre_price = 0;
                    });
                    console.log($scope.sku);
                    CompanyService.chgComanyGoodsSku($scope.sku).then(function (data) {
                        $('#editorModal').modal('hide');
                    }, function (err) {
                        alert(err);
                        $('#editorModal').modal('hide');
                    })
                }

            }

            $scope.selectStatue = function (item) {
                $scope.conditionParams.company_goods_status_id = item.company_goods_status_id;
                $scope.orderStatue.forEach(function (data) {
                    data.select = false;
                })
                item.select = true;
                selectItem = item;
                $scope.currentPage = 1;
                $scope.params = $.extend($scope.params, $scope.conditionParams);
                load($scope.params);
            }
            $scope.update = function () {
                var chgDataJson = {
                    company_goods_id: $scope.goods[item_id].company_goods_id,
                    company_goods_status_id: 10,
                    statue: 0
                }
                CompanyService.chgCompanyGoodsStatue(chgDataJson).then(function (data) {
                    $scope.goods[item_id].statue = 0;
                    $('#delModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }
            $scope.updateDetail = function () {
                $('#updateInformation').modal('hide');
                $location.path("home/updateInformation")
            }
        })

        controllers.controller('CompanyGoodsDetailCtrl', function ($scope, CompanyService, $stateParams, errMap, $state, validation, $q, DeliveryChargeService) {
            $('#dpStart').datepicker({});
            $scope.localImageIp = localImageIp;
            var cancelPil = function () {
                if (this && this.stopPropagation) {
                    console.log("取消冒泡！！");
                    //W3C取消冒泡事件
                    this.stopPropagation();
                } else {
                    console.log("取消冒泡！！");
                    //IE取消冒泡事件
                    window.event.cancelBubble = true;
                }
            }
            console.log($stateParams.goods_id);
            $scope.salesType = [{id: 0, salesName: '正常销售'}, {id: 1, salesName: '预售模式'}];
            $scope.goods_id = $stateParams.goods_id;
            $scope.temperatures = [{id: 1, name: '常温'}, {id: 2, name: '冷藏(0~8℃)'}, {id: 3, name: '冷冻(-18~0℃)'}];
            $scope.sends = [{id: 0, name: '否'}, {id: 1, name: '是'}];
            $scope.repeat_send = [{id: 0, name: '否'}, {id: 1, name: '是'}];
            $scope.company_type = localStorage.company_type;
            $scope.province = {
                province_id: ''
                //province_name:''
            }
            console.log(localStorage);

            $scope.deliveryTemplate = '';
            var getAllDeliveryTemplate = function () {
                CompanyService.getAllDeliveryTemplate().then(function (data) {
                    $scope.deliveryTemplate = data[0];
                    $scope.deliveryTemplates = data;
                }, function (err) {
                    console.log(err);
                })
            }
            getAllDeliveryTemplate();
            CompanyService.getCategories().then(function (data) {

                $scope.cateArr = data;
                console.log("产品分类信息");
                console.log(data);
                if ($stateParams.goods_id == 0) {
                    $scope.good.company_goods_category_id = data[0].categories_id;
                }

            }, function (err) {
                console.log(err);
            })
            CompanyService.getProvinces(function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    $scope.provinces = data;
                    console.log("CompanyService获取的省份信息:");
                    console.log(data);

                }
            })

            $scope.getCitiesByProvinceId = function (index) {
                console.log(index)
                CompanyService.getCitiesByProvinceId(index, function (err, data) {
                    if (err) {
                        alert(err);
                    } else {
                        //$scope.company.city_id
                        $scope.CitiesByProvinceId = data;
                        //$scope.company.city_id=data[0].city_id
                    }
                })
            }
            $scope.good = {
                sales_type: 0,//正常模式，1表示预售模式
                pre_delivery_time: '',
                company_goods_send: 0,
                company_goods_repeat_send: 0,
                temperature: 1,
                save_days: 1,
                company_id: localStorage.company_id,
//HEAD
                repertory_place: '',
//
                areas_name: '未选择城市',
                areas_id: '',
//yunfei
                sku: [{
                    company_goods_left_quantity: 0,
                    company_goods_norms: "",
                    company_goods_price: 0,
                    company_goods_sale_quantity: 0,
                    company_goods_sku_id: null,
                    init_quantity: 0,
                    status: 1,
                    unit: '',
                    norms: '',
                    frequency: 1,
                    lowest_price: 0,
                    in_price: 0,
                    pre_price: 0,
                    deliveryTemplateId: ''
                }]
            };

            DeliveryChargeService.getProvinces(function (err, data) {
                if (err) {
                    alert(err);
                }
                else {
                    console.log("DeliveryChargeService获取的省份信息:");
                    console.log(data);
                    $scope.east_china = {
                        china_id: 1,
                        name: '华东',
                        flag: false,
                        shippingFlag: false,
                        province: [{
                            province_id: 3,
                            province_name: '上海',
                            flag: false,
                            shippingFlag: false
                        }, {province_id: 7, province_name: '江苏', shippingFlag: false, flag: false}, {
                            province_id: 18,
                            province_name: '安徽',
                            shippingFlag: false,
                            flag: false
                        }, {province_id: 19, province_name: '浙江', shippingFlag: false, flag: false}, {
                            province_id: 23,
                            province_name: '江西',
                            shippingFlag: false,
                            flag: false
                        }]
                    }
                    $scope.north_china = {
                        china_id: 2,
                        name: '华北',
                        flag: false,
                        shippingFlag: false,
                        province: [{
                            province_id: 1,
                            province_name: '北京',
                            shippingFlag: false,
                            flag: false
                        }, {province_id: 4, province_name: '天津', shippingFlag: false, flag: false}, {
                            province_id: 12,
                            province_name: '山西',
                            shippingFlag: false,
                            flag: false
                        }, {province_id: 17, province_name: '山东', shippingFlag: false, flag: false}, {
                            province_id: 11,
                            province_name: '河北',
                            shippingFlag: false,
                            flag: false
                        },
                            {province_id: 16, province_name: '内蒙古', shippingFlag: false, flag: false}]
                    }
                    $scope.centra_china = {
                        china_id: 3,
                        name: '华中',
                        flag: false,
                        shippingFlag: false,
                        province: [{
                            province_id: 21,
                            province_name: '湖南',
                            shippingFlag: false,
                            flag: false
                        }, {province_id: 8, province_name: '湖北', shippingFlag: false, flag: false}, {
                            province_id: 13,
                            province_name: '河南',
                            shippingFlag: false,
                            flag: false
                        }]
                    }
                    $scope.south_china = {
                        china_id: 4,
                        name: '华南',
                        flag: false,
                        shippingFlag: false,
                        province: [{
                            province_id: 2,
                            province_name: '广东',
                            shippingFlag: false,
                            flag: false
                        }, {province_id: 22, province_name: '广西', shippingFlag: false, flag: false}, {
                            province_id: 20,
                            province_name: '福建',
                            shippingFlag: false,
                            flag: false
                        }, {province_id: 27, province_name: '海南', shippingFlag: false, flag: false}]
                    }
                    $scope.east_north_china = {
                        china_id: 5,
                        name: '东北',
                        flag: false,
                        shippingFlag: false,
                        province: [{
                            province_id: 6,
                            province_name: '辽宁',
                            shippingFlag: false,
                            flag: false
                        }, {province_id: 14, province_name: '吉林', shippingFlag: false, flag: false}, {
                            province_id: 15,
                            province_name: '黑龙江',
                            shippingFlag: false,
                            flag: false
                        }]
                    }
                    $scope.west_north_china = {
                        china_id: 6,
                        name: '西北',
                        flag: false,
                        shippingFlag: false,
                        province: [{
                            province_id: 10,
                            province_name: '陕西',
                            shippingFlag: false,
                            flag: false
                        }, {province_id: 31, province_name: '新疆', shippingFlag: false, flag: false}, {
                            province_id: 28,
                            province_name: '甘肃',
                            shippingFlag: false,
                            flag: false
                        },
                            {province_id: 29, province_name: '宁夏', shippingFlag: false, flag: false}, {
                                province_id: 30,
                                province_name: '青海',
                                shippingFlag: false,
                                flag: false
                            }
                        ]
                    }
                    $scope.west_south_china = {
                        china_id: 7,
                        name: '西南',
                        flag: false,
                        shippingFlag: false,
                        province: [{
                            province_id: 5,
                            province_name: '重庆',
                            shippingFlag: false,
                            flag: false
                        }, {province_id: 25, province_name: '云南', shippingFlag: false, flag: false}, {
                            province_id: 24,
                            province_name: '贵州',
                            shippingFlag: false,
                            flag: false
                        },
                            {province_id: 26, province_name: '西藏', shippingFlag: false, flag: false}, {
                                province_id: 9,
                                province_name: '四川',
                                shippingFlag: false,
                                flag: false
                            }
                        ]
                    }

                    $scope.china = [$scope.east_china, $scope.north_china, $scope.centra_china, $scope.south_china, $scope.east_north_china, $scope.west_north_china, $scope.west_south_china]
                    console.log($scope.china);
                }
            })

            $scope.cities = [];//所有的城市

            CompanyService.getCities(function (err, data) {

                if (err) {
                    console.log(err);
                    return err;
                }
                else {
                    console.log("获取的城市信息");
                    console.log(data)
                    for (var i = 1; i < 32; i++) {
                        $scope.cities.push({province_id: i, cities: []})
                    }
                    data.results.forEach(function (item) {
                        for (var i = 0; i < $scope.cities.length; i++) {
                            if ($scope.cities[i].province_id == item.province_id) {
                                item.flag = false;
                                item.shippingFlag = false;
                                $scope.cities[i].cities.push(item);
                                break;
                            }
                        }
                    })
                    console.log("省+市信息");
                    console.log($scope.cities);
                    if ($stateParams.goods_id != 0) {
                        CompanyService.getCompanyGoodsDetail({company_goods_id: $stateParams.goods_id}).then(function (data) {
                            $scope.good = data;
//HEAD

                            console.log(typeof $scope.good.company_goods_status_id);

                            console.log($scope.good.company_goods_status_id != 1 || $scope.good.company_goods_status_id != 2);
                            console.log("商品详情===》");
                            console.log($scope.good);
                            if ($scope.good.repertory_place) {
                                CompanyService.getCity($scope.good.repertory_place, function (err, data) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        console.log(data)
                                        $scope.province = data.province;
                                        // $scope.province=$scope.provinces[0];
                                        $scope.getCitiesByProvinceId($scope.province.province_id);
                                        $scope.good.repertory_place = data.city.city_id;
                                    }
                                });
                            }

//
                            console.log(!$scope.good.areas_id);   //可售区域
                            if ($scope.good.areas_id) {
                                var cities = $scope.good.areas_id.split(',');
                                console.log('cities=');
                                console.log(cities);
                                cities.forEach(function (item) {
                                    var area;
                                    var pro;
                                    var city;
                                    var province_id;
                                    console.log($scope.cities);
                                    for (var i = 0; i < $scope.cities.length; i++) {

                                        var j = containCity($scope.cities[i].cities, parseInt(item));
                                        if (j == -1) {
                                            continue;
                                        }
                                        else {
                                            city = j;
                                            city.flag = true;
                                            province_id = $scope.cities[i].province_id;
                                            break;
                                        }

                                    }
                                    console.log('province_id==');
                                    console.log(province_id);
                                    var response = containProvince(province_id);
                                    console.log('response=');
                                    console.log(response);

                                    pro = response.pro;
                                    console.log('pro=');
                                    console.log(pro);
                                    area = response.area;
                                    console.log('area=');
                                    console.log(area);
                                    $scope.selectCities(area, pro, city);
                                })
                            }


//yunfei
                            for (var i in $scope.good.sku) {
                                $scope.good.sku[i].norms = $scope.good.sku[i].company_goods_norms.split("/")[0];
                                $scope.good.sku[i].unit = $scope.good.sku[i].company_goods_norms.split("/")[1];
                            }
                            if ($scope.good.company_goods_icon)$scope.covers = IconIp + $scope.good.company_goods_icon;
                            console.log(data);
                            imgArray = data.company_goods_detail_img.split(";");
                            imgArray.pop();
                            $scope.files = [];
                            imgArray.forEach(function (item) {
                                $scope.files.push(item);
                            })
                            for (var i in $scope.files) {
                                $scope.files[i] = ImgIp + $scope.files[i];
                            }
                        }, function (err) {
                            console.log(err);
                        })
                    }

                }
            })

            console.log($scope.good);
            var errStatueMap = errMap.getMap();
            var imgArray = [];

            var containCity = function (arr, value) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].city_id == value) {
                        return arr[i];
                    }
                }
                return -1;
            }
            var contain = function (arr, value) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].province_id == value) {
                        return arr[i];
                    }
                }
                return -1;
            }
            var containProvince = function (value) {
                var response = {
                    pro: '',
                    area: ''
                }
                console.log('$scope.china.length==');
                console.log($scope.china.length);
                for (var i = 0; i < $scope.china.length; i++) {
                    var j = contain($scope.china[i].province, value)
                    if (j == -1) {
                        continue;
                    }
                    else {
                        response.pro = j;
                        response.area = $scope.china[i];
                        return response;
                    }
                }
            }
            $scope.loadProvince = function () {
                $scope.china.forEach(function (item) {
                    item.province.forEach(function (province) {
                        province.visible = false;
                        province.myStyle = {
                            "background-color": "#ffffff"
                        }
                    })
                })
                $('#provinceModal').modal();
            }
            $scope.selectAllProvince = function (item) {  //选择区域下的所有省份
                console.log("选择区域下的所有省份！！！");
                cancelPil();
                item.province.forEach(function (pro) {
                    pro.flag = item.flag;
                    $scope.cities[pro.province_id - 1].cities.forEach(function (city) {
                        city.flag = item.flag;
                    })
                })

            }
            $scope.selectProvince = function (area, item) {
                console.log("单选省份！！！");
                cancelPil();
                console.log(area.province.length);
                var i = 0;
                area.province.forEach(function (pro) {
                    if (pro.flag == true) {
                        i++
                    }
                })
                if (i != area.province.length) {    //如果所属区域下的省都选了，则该区域处于勾选状态
                    area.flag = false;
                }
                else {
                    area.flag = true;
                }
                $scope.cities[item.province_id - 1].cities.forEach(function (city) {
                    city.flag = item.flag;
                })

            }
            $scope.selectCities = function (area, pro, city) {
                cancelPil();
                //单选城市
                var i = 0;
                $scope.cities[pro.province_id - 1].cities.forEach(function (city) {
                    if (city.flag == true) {
                        i++;
                    }
                })
                if (i != $scope.cities[pro.province_id - 1].cities.length) {   //如果所属省下的城市都选了，则该省处于勾选状态
                    pro.flag = false;
                }
                else {
                    pro.flag = true;
                }
                var j = 0;
                area.province.forEach(function (pro) {
                    if (pro.flag == true) {
                        j++;
                    }
                })
                if (j != area.province.length) {   //如果所属区域下的省都选了，则该区域处于勾选状态
                    area.flag = false;
                }
                else {
                    area.flag = true;
                }
                city.flag = city.flag;
            }
            $scope.toggle = function (pro) {
                cancelPil();
                pro.myStyle = {
                    "background-color": "#ffffff"
                }
                $scope.china.forEach(function (item) {
                    item.province.forEach(function (province) {
                        if (pro != province) {
                            console.log(pro != province)
                            console.log(pro == province)
                            province.visible = false;
                            province.myStyle = {
                                "background-color": "#ffffff"
                            }
                        }
                    })
                })
                pro.visible = !pro.visible;

                if (pro.visible) {
                    pro.myStyle = {
                        "background-color": "#ffffc7"
                    }
                }

            }

            //保存可售区域
            $scope.saveCities = function () {

                /*var cities_to_string='';  //城市名组成的字符串
                 var cities_id_to_string='';  //城市ID组成的字符串*/
                $scope.good.areas_name = '';
                $scope.good.areas_id = '';

                $scope.china.forEach(function (item) {  //遍历区域（华东，华西等）
                    var cities_to_string = '';  //城市名组成的字符串
                    var cities_id_to_string = '';  //城市ID组成的字符串
                    if (item.flag == true) {   //如果区域全选
                        //$scope.rules[$scope.current_rule_id].areas_name+=item.name+',';
                        item.province.forEach(function (pro) {   //遍历区域下的省
                            var cities = [];
                            var cities_id = [];
                            $scope.cities[pro.province_id - 1].cities.forEach(function (city) {  //遍历省下的城市
                                cities.push(city.city_name);
                                cities_id.push(city.city_id);

                            })
                            cities_to_string += cities.join(',') + ",";
                            cities_id_to_string += cities_id.join(',') + ",";
                        })
                        $scope.good.areas_name += item.name + ",";   //售卖区域的名字，如果区域全选，则保存区域
                        $scope.good.areas_id += cities_id_to_string;   //售卖区域的ID串

                    }
                    else {        //区域没有全选

                        item.province.forEach(function (pro) {
                            var cities_to_string = '';  //城市名组成的字符串
                            var cities_id_to_string = '';  //城市ID组成的字符串
                            if (pro.flag == true) {   //省全选
                                var province = pro.province_name;
                                var cities = [];
                                var cities_id = [];
                                $scope.cities[pro.province_id - 1].cities.forEach(function (city) {  //遍历省下的城市
                                    cities.push(city.city_name);
                                    cities_id.push(city.city_id);
                                })

                                cities_to_string += cities.join(',') + ",";
                                cities_id_to_string += cities_id.join(',') + ",";
                                $scope.good.areas_name += province + ",";
                                $scope.good.areas_id += cities_id_to_string;

                            }
                            else {    //省没有全选
                                $scope.cities[pro.province_id - 1].cities.forEach(function (city) {
                                    var cities_to_string = '';  //城市名组成的字符串
                                    var cities_id_to_string = '';  //城市ID组成的字符串
                                    if (city.flag == true) {
                                        console.log($scope.good.areas_id);
                                        console.log(city.city_id);
                                        $scope.good.areas_name += city.city_name + ',';
                                        $scope.good.areas_id += city.city_id + ',';
                                    }
                                })

                            }
                        })
                    }
                })

                $scope.good.areas_name = $scope.good.areas_name.substring(0, $scope.good.areas_name.length - 1);
                $scope.good.areas_id = $scope.good.areas_id.substring(0, $scope.good.areas_id.length - 1);
                console.log("可售区域为======》");
                console.log($scope.good.areas_name);
                console.log($scope.good.areas_id);


            }

            var waitDelImg = {
                icon: [],
                img: []
            };
            //存放商品图片
            $scope.files = [];

            $scope.uploadDetail = function ($files, $file) {
                console.log("选择商品图片！！！");
                console.log($files);
                $scope.files = $files;
            }

            $scope.upload = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
                console.log("选择商品LOGO");
                console.log("$file===>");
                console.log($file);
                console.log("$files===>");
                console.log($files);
                if ($file) {
                    $scope.covers = $file;
                    console.log($scope.good.company_goods_icon);
                    console.log(Object.prototype.toString.call($scope.good.company_goods_icon));
                    if (Object.prototype.toString.call($scope.good.company_goods_icon) == "[object String]") {
                        waitDelImg.icon.push($scope.good.company_goods_icon);
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

            $scope.delNorm = function (index) {
                $scope.good.sku[index].status = 0;
                if (!$scope.good.sku[index].company_goods_sku_id) {
                    $scope.good.sku.splice(index, 1);
                }
            }

            $scope.addNorm = function () {
                $scope.good.sku.push({
                    company_goods_left_quantity: 0,
                    company_goods_norms: "",
                    company_goods_price: 0,
                    company_goods_sale_quantity: 0,
                    company_goods_sku_id: null,
                    init_quantity: 0,
                    status: 1,
                    unit: '',
                    norms: '',
                    frequency: 1,
                    lowest_price: 0,
                    in_price: 0,
                    pre_price: 0,
                    deliveryTemplateId: ''
                });
            }

            $scope.update = function (statueId) {
                var flag = false;
                $scope.good.sku.forEach(function (item) {
                    if (item.company_goods_sku_type != 0) {
                        //alert('此商品正在搞活动，请先暂停活动！！');
                        flag = true;
                    }
                })
                if (flag == false) {
                    $("button").attr("disabled", "disabled");
                    var chgDataJson = {
                        company_goods_id: $scope.good.company_goods_id,
                        company_goods_status_id: statueId,
                        statue: 1
                    }
                    CompanyService.chgCompanyGoodsStatue(chgDataJson).then(function (data) {
                        $state.go('home.companyGoods');
                    }, function (err) {
                        $("button").removeAttr("disabled");
                        alert(err);
                    })
                }
                else {
                    alert('此商品正在搞活动，请先暂停活动！！！');
                }


            }
            $scope.save = function (statue_id) {
                console.log(statue_id);
                console.log($scope.good.sku[0].company_goods_price);
                console.log($scope.good.sku[0].lowest_price);

                console.log($scope.good.company_goods_status_id);
                $scope.good.pre_delivery_time = $('#dpStart').val();
                console.log($scope.good);

                $("button").attr("disabled", "disabled");  //将所有button的disable属性值设置为disable

                console.log('statue_id=' + statue_id);
                /* if(statue_id!=10)*/
                if (statue_id != 10) {

                    var res = validate();
                    if (res) {

                        $("button").removeAttr("disabled");
                        return alert(errStatueMap[res]);
                    }
                }


                $scope.good.sku.forEach(function (item) {
                    item.company_goods_norms = item.norms + '/' + item.unit;
                    if (!item.company_goods_left_quantity)item.company_goods_left_quantity = 0;
                    if (!item.company_goods_price)item.company_goods_price = 0;
                    if (!item.init_quantity)item.init_quantity = 0;
                    if (!item.frequency)item.frequency = 1;
                    if (!item.lowest_price)item.lowest_price = 0;
                    if (!item.in_price)item.in_price = 0;
                    if (!item.pre_price)item.pre_price = 0;
                });
                $scope.good.company_goods_status_id = statue_id;

                var arr = [$scope.covers];
                console.log(arr[0]);
                if ($scope.covers) {
                    var iconResize = CompanyService.resize(arr, 300, 300, 0.5, '1:1');
                    iconResize.then(function (data) {
                        $scope.good.company_goods_icon = arr[0];
                        console.log($scope.good.company_goods_icon);
                    }, function (err) {
                        console.log(err);
                    })
                }

                var imgResize = CompanyService.resize($scope.files, null, null, 0.3, null);
                imgResize.then(function (data) {
                }, function (err) {
                    console.log(err)
                });
                var promiseResizeAll = $q.all([imgResize, iconResize]);
                promiseResizeAll.then(function (data) {
                    if ($stateParams.goods_id == 0) {
                        console.log('re')

                        addSave(function (err, data) {
                            if (err) {
                                alert(errStatueMap[err]);
                                $("button").removeAttr("disabled");
                            } else {
                                $state.go('home.companyGoods');
                            }
                        });
                    } else {
                        console.log('gfd ')
                        var k = 0;
                        updateSave(function (err, data) {
                            k++;
                            if (!err || !data) {
                                alert('修改出错');
                                $("button").removeAttr("disabled");
                                k = 0;
                            }
                            if (k == 2) {
                                console.log('das ')
                                console.log($scope.good);
                                var chgGood = CompanyService.chgCompanyGoods($scope.good);
                                chgGood.then(function (res) {
                                    $state.go('home.companyGoods');

                                }, function (err) {
                                    $("button").removeAttr("disabled");
                                    alert(err);
                                })
                            }
                        });
                    }

                }, function (err) {

                });
            }

            function addSave(cb) {
                console.log('保存图片');
                console.log($scope.files);

                $scope.files.splice($scope.files.length - 1, 1);
                var uploadImgPromise = CompanyService.uploadImg(imgUploadIP, $scope.files);
                uploadImgPromise.then(function (res) {
                    $scope.good.company_goods_detail_img = '';
                    res.data.path.forEach(function (item) {
                        $scope.good.company_goods_detail_img += item + ';';
                    })
                }, function (err) {
                    console.log(err);
                }, function (update) {
                    console.log(update);
                });
                var uploadIconPromise = CompanyService.uploadImg(iconUploadIP, $scope.good.company_goods_icon);
                uploadIconPromise.then(function (res) {
                    $scope.good.company_goods_icon = res.data.path;
                }, function (err) {
                    console.log(err);
                }, function (update) {
                    console.log(update);
                });

                var promiseUploadAll = $q.all([uploadImgPromise, uploadIconPromise]);
                promiseUploadAll.then(function (data) {
                    console.log($scope.good);
                    var addGood = CompanyService.addCompanyGoods($scope.good);
                    addGood.then(function (data) {
                        console.log(data);
                        cb(null, true);
                    }, function (err) {
                        cb(err, null);
                    })

                }, function (err) {

                })
            }

            function updateSave(cb) {
                var delImg = CompanyService.delImg(waitDelImg.icon, waitDelImg.img);
                delImg.then(function (res) {
                    console.log(res);
                }, function (err) {
                    console.log(err);
                }, function (update) {
                    console.log(update);
                });
                console.log(waitDelImg);

                if (waitDelImg.icon.length != 0 || (Object.prototype.toString.call($scope.good.company_goods_icon) != "[object String]")) {
                    var uploadIconPromise = CompanyService.uploadImg(iconUploadIP, $scope.good.company_goods_icon);
                    uploadIconPromise.then(function (res) {
                        $scope.good.company_goods_icon = res.data.path;
                        cb(true, true);
                    }, function (err) {
                        cb(false, true);
                        console.log(err);
                    }, function (update) {
                        console.log(update);
                    });
                } else {
                    cb(true, true);
                    console.log($scope.good.company_goods_icon);
                    if ($scope.good.company_goods_icon)$scope.good.company_goods_icon = $scope.good.company_goods_icon.substring(IconIp.length, $scope.good.company_goods_icon.length);
                }


                var imgArray = [];
                for (var i = 0; i < $scope.files.length; i++) {
                    var item = $scope.files[i];
                    if (Object.prototype.toString.call(item) != "[object String]") {
                        imgArray.push(item);
                        console.log(item);
                        $scope.files[i] = i;
                    }
                }
                var uploadImgPromise = CompanyService.uploadImg(imgUploadIP, imgArray);
                uploadImgPromise.then(function (res) {
                    for (var i = 0; i < $scope.files.length; i++) {
                        var item = $scope.files[i];
                        console.log(item);
                        if (!isNaN(item)) {
                            $scope.files[i] = res.data.path[0];
                            res.data.path.splice(0, 1);
                        } else {
                            console.log($scope.files[i]);
                            $scope.files[i] = $scope.files[i].substring(ImgIp.length, $scope.files[i].length);
                        }
                    }
                    $scope.good.company_goods_detail_img = '';
                    $scope.files.forEach(function (item) {
                        $scope.good.company_goods_detail_img += item + ';';
                    })
                    cb(true, true);
                }, function (err) {
                    cb(true, false);
                    console.log(err);
                }, function (update) {
                    console.log(update);
                });

            }

            /*
             function validate (){
             for(var i=0;i<$scope.good.sku.length;i++){
             var item=$scope.good.sku[i];
             if(item.status==0&&!item.company_goods_sku_id){
             $scope.good.sku.splice(i,1);
             }
             }

             var icon_legal=validation.checkNull($scope.covers,'ICON_NULL');   //验证
             var name_legal=validation.checkGoodName($scope.good.company_goods_name);  //验证商品名称
             var place_legal=validation.checkLength($scope.good.company_goods_place,0,8,'PLACE_NULL','PLACE_LONG');
             var detail_legal=validation.checkNull($scope.good.company_goods_details,'DETAIL_NULL');
             var detail_img_legal=validation.checkLength($scope.files,2,9,'DETAIL_IMG_MIN','DETAIL_IMG_MAX');
             // HEAD
             var repertory_place_legal=validation.checkRepertory_place($scope.good.repertory_place);
             var pre_send_time_legal=validation.checkNull($scope.good.pre_delivery_time,'PRE_SEND_TIME_NULL');
             var pre_send_time_hg_current_time_legal=validation.checkTime($scope.good.pre_delivery_time);

             //
             var citiesLegal=validation.checkCities($scope.good.areas_name);
             //yunfei
             var sku_length_legal;
             var sku_norm_legal;
             var sku_price_legal;
             var sku_quantity_legal;
             var sku_unit_legal;
             var sku_init_quantity_legal;
             var sku_frequency_legal;
             var qualityHgInit;
             var lowest_legal;
             var PriceHgLowestPrice_legal;
             var pre_price;
             var preHgLowestPrice_legal;
             var goods=[];
             console.log($scope.good.sku);
             $scope.good.sku.forEach(function(item){
             if(item.status==1){
             goods.push(item);
             }
             })
             if(goods.length==0){
             sku_length_legal=validation.checkNull(goods,'SKU_NULL');
             }
             goods.forEach(function(item){
             var norm_legal=validation.checkNull(item.norms,'NORM_NULL');
             var unit_legal=validation.checkNull(item.unit,'UNIT_NULL');
             var price_legal=validation.checkPrice(item.company_goods_price,'PRICE_ERROE');
             console.log(localStorage.company_type=='1');
             console.log(localStorage.company_type);
             if(localStorage.company_type=='0'){

             var lowest_item_legal=validation.checkPrice(item.lowest_price,'PRICE_ERROE');

             var PriceHgLowestPrice_item_legal=validation.checkSalePriceHgLowestPrice(item.company_goods_price,item.lowest_price);
             alert(PriceHgLowestPrice_item_legal);
             } else{
             var lowest_item_legal=validation.checkPrice(item.in_price,'PRICE_ERROE');
             console.log(item.pre_price);
             console.log('ssss')
             var PriceHgLowestPrice_item_legal=validation.checkSalePriceHgLowestPrice(item.company_goods_price,item.in_price);
             }
             if($scope.good.sales_type==1){
             var pre_item_legal=validation.checkPrice(item.pre_price,'PRICE_ERROE');
             var preHgLowestPrice_item_legal=validation.checkSalePriceHgLowestPrice(item.company_goods_price,item.pre_price);
             if(pre_item_legal){
             pre_price=pre_item_legal;
             }
             if(preHgLowestPrice_item_legal){
             preHgLowestPrice_legal=preHgLowestPrice_item_legal;
             }
             }
             var quantity_legal=validation.checkNumber(item.company_goods_left_quantity,'QUANTITY_ERROR');
             var init_quantity_legal=validation.checkNumber(item.init_quantity,'INIT_QUANTITY_ERROR');
             var frequency_legal=validation.checkNumber(item.frequency,'FREQUENCY_ERROR');
             var quality_hg_init_legal=validation.checkQuality(item.company_goods_left_quantity,item.init_quantity);

             if(norm_legal){
             sku_norm_legal=norm_legal;
             }
             if(unit_legal){
             sku_unit_legal=unit_legal;
             }
             if(price_legal){
             sku_price_legal=price_legal;
             }
             if(quantity_legal){
             sku_quantity_legal=quantity_legal;
             }
             if(init_quantity_legal){
             sku_init_quantity_legal=init_quantity_legal;
             }
             if(frequency_legal){
             sku_frequency_legal=frequency_legal;
             }
             if(quality_hg_init_legal){
             qualityHgInit=quality_hg_init_legal;
             }
             if(lowest_item_legal){
             lowest_legal=lowest_item_legal;
             }
             if(PriceHgLowestPrice_item_legal){
             PriceHgLowestPrice_legal=PriceHgLowestPrice_item_legal;
             }
             });
             if($scope.good.sales_type==1){
             var arr=[icon_legal,name_legal,place_legal,repertory_place_legal,pre_send_time_legal,pre_send_time_hg_current_time_legal,detail_legal,detail_img_legal,sku_length_legal,sku_norm_legal,sku_unit_legal,sku_price_legal,lowest_legal,PriceHgLowestPrice_legal,pre_price,preHgLowestPrice_legal,sku_quantity_legal,sku_init_quantity_legal,sku_frequency_legal,qualityHgInit];
             }else{
             var arr=[icon_legal,name_legal,place_legal,repertory_place_legal,detail_legal,detail_img_legal,sku_length_legal,sku_norm_legal,sku_unit_legal,sku_price_legal,lowest_legal,PriceHgLowestPrice_legal,sku_quantity_legal,sku_init_quantity_legal,sku_frequency_legal,qualityHgInit];

             //HEAD
             }
             //
             var arr=[icon_legal,name_legal,place_legal,citiesLegal,detail_legal,detail_img_legal,sku_length_legal,sku_norm_legal,sku_unit_legal,sku_price_legal,sku_quantity_legal,sku_init_quantity_legal,sku_frequency_legal];
             // yunfei
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
             */

            function validate() {
                for (var i = 0; i < $scope.good.sku.length; i++) {
                    var item = $scope.good.sku[i];
                    if (item.status == 0 && !item.company_goods_sku_id) {
                        $scope.good.sku.splice(i, 1);
                    }
                }

                var icon_legal = validation.checkNull($scope.covers, 'ICON_NULL');
                var name_legal = validation.checkGoodName($scope.good.company_goods_name);
                var place_legal = validation.checkLength($scope.good.company_goods_place, 0, 8, 'PLACE_NULL', 'PLACE_LONG');
                var detail_legal = validation.checkNull($scope.good.company_goods_details, 'DETAIL_NULL');
                var detail_img_legal = validation.checkLength($scope.files, 2, 9, 'DETAIL_IMG_MIN', 'DETAIL_IMG_MAX');
                var repertory_place_legal = validation.checkRepertory_place($scope.good.repertory_place);
                var pre_send_time_legal = validation.checkNull($scope.good.pre_delivery_time, 'PRE_SEND_TIME_NULL');
                var pre_send_time_hg_current_time_legal = validation.checkTime($scope.good.pre_delivery_time);

                var sku_length_legal;
                var sku_norm_legal;
                var sku_price_legal;
                var sku_quantity_legal;
                var sku_unit_legal;
                var sku_init_quantity_legal;
                var sku_frequency_legal;
                var qualityHgInit;
                var lowest_legal;
                var PriceHgLowestPrice_legal;
                var pre_price;
                var preHgLowestPrice_legal;
                var goods = [];
                console.log($scope.good.sku);
                $scope.good.sku.forEach(function (item) {
                    if (item.status == 1) {
                        goods.push(item);
                    }
                })
                if (goods.length == 0) {
                    sku_length_legal = validation.checkNull(goods, 'SKU_NULL');
                }
                goods.forEach(function (item) {
                    var norm_legal = validation.checkNull(item.norms, 'NORM_NULL');
                    var unit_legal = validation.checkNull(item.unit, 'UNIT_NULL');
                    var price_legal = validation.checkPrice(item.company_goods_price, 'PRICE_ERROE');
                    console.log(localStorage.company_type == '1');
                    console.log(localStorage.company_type);
                    if (localStorage.company_type == '0') {
                        var lowest_item_legal = validation.checkPrice(item.lowest_price, 'PRICE_ERROE');
                        var PriceHgLowestPrice_item_legal = validation.checkSalePriceHgLowestPrice(item.company_goods_price, item.lowest_price);
                    }
                    else {
                        var lowest_item_legal = validation.checkPrice(item.in_price, 'PRICE_ERROE');
                        console.log(item.pre_price);
                        console.log('ssss')
                        var PriceHgLowestPrice_item_legal = validation.checkSalePriceHgLowestPrice(item.company_goods_price, item.in_price);
                    }
                    if ($scope.good.sales_type == 1) {
                        var pre_item_legal = validation.checkPrice(item.pre_price, 'PRICE_ERROE');
                        var preHgLowestPrice_item_legal = validation.checkSalePriceHgLowestPrice(item.company_goods_price, item.pre_price);
                        if (pre_item_legal) {
                            pre_price = pre_item_legal;
                        }
                        if (preHgLowestPrice_item_legal) {
                            preHgLowestPrice_legal = preHgLowestPrice_item_legal;
                        }
                    }
                    var quantity_legal = validation.checkNumber(item.company_goods_left_quantity, 'QUANTITY_ERROR');
                    var init_quantity_legal = validation.checkNumber(item.init_quantity, 'INIT_QUANTITY_ERROR');
                    var frequency_legal = validation.checkNumber(item.frequency, 'FREQUENCY_ERROR');
                    var quality_hg_init_legal = validation.checkQuality(item.company_goods_left_quantity, item.init_quantity);

                    if (norm_legal) {
                        sku_norm_legal = norm_legal;
                    }
                    if (unit_legal) {
                        sku_unit_legal = unit_legal;
                    }
                    if (price_legal) {
                        sku_price_legal = price_legal;
                    }
                    if (quantity_legal) {
                        sku_quantity_legal = quantity_legal;
                    }
                    if (init_quantity_legal) {
                        sku_init_quantity_legal = init_quantity_legal;
                    }
                    if (frequency_legal) {
                        sku_frequency_legal = frequency_legal;
                    }
                    if (quality_hg_init_legal) {
                        qualityHgInit = quality_hg_init_legal;
                    }
                    if (lowest_item_legal) {
                        lowest_legal = lowest_item_legal;
                    }
                    if (PriceHgLowestPrice_item_legal) {
                        PriceHgLowestPrice_legal = PriceHgLowestPrice_item_legal;
                    }
                });
                if ($scope.good.sales_type == 1) {
                    var arr = [icon_legal, name_legal, place_legal, repertory_place_legal, pre_send_time_legal, pre_send_time_hg_current_time_legal, detail_legal, detail_img_legal, sku_length_legal, sku_norm_legal, sku_unit_legal, sku_price_legal, lowest_legal, PriceHgLowestPrice_legal, pre_price, preHgLowestPrice_legal, sku_quantity_legal, sku_init_quantity_legal, sku_frequency_legal, qualityHgInit];
                } else {
                    var arr = [icon_legal, name_legal, place_legal, repertory_place_legal, detail_legal, detail_img_legal, sku_length_legal, sku_norm_legal, sku_unit_legal, sku_price_legal, lowest_legal, PriceHgLowestPrice_legal, sku_quantity_legal, sku_init_quantity_legal, sku_frequency_legal, qualityHgInit];

                }
                var res = false;
                console.log(arr);

                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    if (item) {
                        res = item;
                        break;
                    }
                }
                return res;
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
        });
        controllers.controller('updateCtrl', function ($scope, CompanyService, $stateParams, errMap, $state, validation, $q) {
            $scope.localImageIp = localImageIp;
        });
    });
