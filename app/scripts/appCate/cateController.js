

define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('CateCtrl', function ($scope, CateService, validation, errMap, $state) {
            var load = function () {
                CateService.getCateList().then(function (data) {
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
                CateService.delCate(delJson).then(function (data) {
                    $scope.cateList[item_index].status = 0;
                    console.log("删除成功");
                    $('#deleteModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }
            $scope.getDetail = function (cateId) {
                $state.go("home.addCate", {cateId: cateId});
            }
        });

        controllers.controller('AddCateCtrl', function ($scope, CateService,ProductService,$stateParams, validation, errMap, $state) {
            $scope.cateId = $stateParams.cateId;

            //var cancelPil = function () {
            //    if (this && this.stopPropagation) {
            //        console.log("取消冒泡！！");
            //        //W3C取消冒泡事件
            //        this.stopPropagation();
            //    } else {
            //        console.log("取消冒泡！！");
            //        //IE取消冒泡事件
            //        window.event.cancelBubble = true;
            //    }
            //}
            if ($scope.cateId != 0) {
                CateService.getCateDetail($scope.cateId).then(function (data) {
                    console.log(data);
                    $scope.cate = data;
                })
            }

            $scope.back = function () {
                history.back();
            }
            $scope.save = function(){
                if ($scope.cateId != 0) {
                    $scope.cate.id = $scope.cateId;
                    CateService.updateCate($scope.cate).then(function (data) {
                        //console.log(data);
                        $state.go('home.cate');
                    }, function (err) {
                        console.log(err);
                    })
                }else{
                    CateService.addCate($scope.cate).then(function (data) {
                        //console.log(data);
                        $state.go('home.cate');
                    }, function (err) {
                        console.log(err);
                    })
                }

            }
        });

    });