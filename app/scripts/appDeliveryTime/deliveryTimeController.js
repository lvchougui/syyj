

define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('DeliveryTimeCtrl', function ($scope, DeliveryTimeService, validation, errMap, $state) {
            var load = function () {
                DeliveryTimeService.getTimeList().then(function (data) {
                    $scope.timeList = data;
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
            $scope.delDeliveryTime = function () {
                var delJson = {
                    delivery_time_id: $scope.timeList[item_index].id
                }
                console.log(delJson)
                DeliveryTimeService.delDeliveryTime(delJson).then(function (data) {
                    $scope.timeList[item_index].status = 0;
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
            $scope.time = {
                city_id:'',
                district_name_toString:'',
                district_id_toString:'',
                delivery_time:''
            }
            $scope.DistrictsByCityId = [];
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
                        $scope.CitiesByProvinceId = data;
                    }
                })
            }
            $scope.loadDistricts = function(){
                var city_id = $scope.time.city_id;
                if(city_id == ''){
                    alert('请先选择配送城市');
                }else{
                    $scope.DistrictsByCityId = [];
                    CompanyService.getDistrictsByCityId(city_id,function(err,data){
                        if(err){
                            alert(err);
                        }else{
                            data.results.forEach(function (item) {
                                item.flag = false;
                                $scope.DistrictsByCityId.push(item);
                            })
                            console.log("aaaaaaa");
                            console.log($scope.DistrictsByCityId);
                            $('#districtsModal').modal();
                        }
                    })
                }
            }
            $scope.selectDistrict = function(district){
                for(var i = 0;i < $scope.DistrictsByCityId.length;i++){
                    if($scope.DistrictsByCityId[i].district_id == district.district_id){
                        $scope.DistrictsByCityId[i].flag = district.flag;
                        break;
                    }
                }
                console.log($scope.DistrictsByCityId);
            }
            $scope.saveDistricts = function(){
                var district_names = [];
                var district_ids = [];
                //var district_name_toString = '';
                //var district_id_toString = '';
                $scope.DistrictsByCityId.forEach(function(item){
                    if(item.flag == true){
                        district_names.push(item.district_name);
                        district_ids.push(item.district_id);
                    }
                })
                //district_name_toString += district_names.join(',')+",";
                //district_id_toString += district_ids.join(',')+",";
                //$scope.time.district_name_toString = district_name_toString;
                //$scope.time.district_id_toString = district_id_toString;
                $scope.time.district_name_toString = district_names.toString();
                $scope.time.district_id_toString = district_ids.toString();
                console.log($scope.time.district_name_toString);
                console.log($scope.time.district_id_toString);
            }
            $scope.checkDays = [
                '周一',
                '周二',
                '周三',
                '周四',
                '周五',
                '周六',
                '周日',
            ];
            $scope.checkTimes = [
                '0:00-2:00',
                '2:00-4:00',
                '4:00-6:00',
                '6:00-8:00',
                '8:00-10:00',
                '10:00-12:00',
                '12:00-14:00',
                '14:00-16:00',
                '16:00-18:00',
                '18:00-20:00',
                '20:00-22:00',
                '22:00-24:00',
            ];
            var items = [];
            for(var i = 0;i < $scope.checkTimes.length;i++){
                items.push(
                    {
                        'id':i,
                        'name':$scope.checkTimes[i],
                        'times':[]
                    }
                );
                for(var j = 0; j < $scope.checkDays.length;j++){
                    items[i].times.push(
                        {
                            'id':j,
                            'day':$scope.checkDays[j],
                            'time':$scope.checkTimes[i],
                            'flag':false
                        }
                    );
                }
            }
            $scope.items = items;
            $scope.loadTimes = function(){
                $('#timesModal').modal();
            }
            $scope.selectTime = function(item,time){
                //cancelPil();
                for(var i = 0;i < $scope.items.length;i++){
                    if($scope.items[i].id == item.id){
                        for(var j = 0;j < $scope.items[i].times.length;j++){
                            if($scope.items[i].times[j].id == time.id){
                                $scope.items[i].times[j].flag = time.flag;
                                break;
                            }
                        }
                    }
                }
            }
            $scope.saveTimes = function(){
                var times = [];
                $scope.items.forEach(function(item){
                    item.times.forEach(function(time){
                        if(time.flag == true){
                            times.push(
                              time.day+time.time
                            );
                        }
                    })
                })
                $scope.time.delivery_time = times.toString();
            }
            $scope.back = function () {
                history.back();
            }
            $scope.save = function(){
                if($scope.time.district_id_toString == ''){
                    alert('请先选择配送区域');
                }
                if($scope.time.delivery_time == ''){
                    alert('请先选择配送时间');
                }
                var data = {
                    district_ids:$scope.time.district_id_toString,
                    district_names:$scope.time.district_name_toString,
                    delivery_time:$scope.time.delivery_time
                }
                DeliveryTimeService.addDeliveryTime(data).then(function (data) {
                    console.log(data);
                    $state.go('home.delivery_time');
                }, function (err) {
                    console.log(err);
                })
            }
        });

    });