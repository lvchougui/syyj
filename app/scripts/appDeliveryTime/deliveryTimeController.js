

define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('DeliveryTimeCtrl', function ($scope, DeliveryTimeService, validation, errMap, $state) {
            var load = function () {
                DeliveryTimeService.getCateList().then(function (data) {
                    $scope.cateList = data;
                    console.log(data);
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
            $scope.delCate = function () {
                var delJson = {
                    cateId: $scope.cateList[item_index].id
                }
                //console.log(delJson)
                DeliveryTimeService.delCate(delJson).then(function (data) {
                    $scope.cateList[item_index].status = 0;
                    console.log("删除成功");
                    $('#deleteModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }
        });

        controllers.controller('AddDeliveryTimeCtrl', function ($scope, DeliveryTimeService,CompanyService, validation, errMap, $state) {
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
            $scope.cateName='';
            $scope.back = function () {
                history.back();
            }
            $scope.save = function(){

                var data = {
                    cateName:$scope.cateName
                }
                DeliveryTimeService.addCate(data).then(function (data) {
                    //console.log(data);
                    $state.go('home.cateStore');
                }, function (err) {
                    console.log(err);
                })
            }
        });

    });