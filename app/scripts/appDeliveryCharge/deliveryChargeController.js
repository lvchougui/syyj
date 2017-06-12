/**
 * Created by younong-3 on 2016/5/30.
 */
/**
 * Created by wei on 16/1/12.
 */



define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('DeliveryChargeCtrl',function ($scope,DeliveryChargeService,$stateParams,errMap,$state,validation,$q) {
            $scope.localImageIp=localImageIp;
            $scope.point=[];
            $scope.page=1;
            $scope.count = 0;
            $scope.currentPage = 1;
            $scope.numPages = 1;
            $scope.pageSize = 5;
            $scope.pages = [];
            $scope.pageStart = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.pageEnd = $scope.pageSize;
            var load = function (page) {
                console.log('sssss');
                DeliveryChargeService.getDeliveryTemplates(page,$scope.pageSize,function (err,data) {

                    if(err){
                        console.log(err)
                    }
                    else{
                        $scope.count=data.count;
                        $scope.templates=data.data
                        console.log(data)
                        if($scope.count>0){
                            $scope.numPages=($scope.count-1)/$scope.pageSize+1;
                            $scope.pageStart=($scope.currentPage-1)*$scope.pageSize+1;
                            console.log($scope.pageStart);
                            $scope.pageEnd=$scope.currentPage*$scope.pageSize>$scope.count?$scope.count:$scope.currentPage*$scope.pageSize;
                        }
                      else{
                            $scope.numPages=1;
                            $scope.pageStart=0;
                            console.log($scope.pageStart);
                            $scope.pageEnd=0;
                        }
                    }
                })
            }
            console.log($scope.currentPage)
                load($scope.currentPage);
            $scope.onSelectPage= function (page) {
                $scope.currentPage=page;
                load(page);
            }
            $scope.judge=function(page,index){
                if(Math.abs($scope.currentPage - page)==5&&page!=1&&page!=$scope.numPages){
                    $scope.point[index]=true;
                }else{
                    $scope.point[index]=false;
                }

                if(Math.abs($scope.currentPage - page)<=5||page==$scope.numPages||page==1){
                    return true;
                }else{
                    return false;
                }
            }
            $scope.del = function (index) {
                var deliveryTemplateId=$scope.templates[index].deliveryTemplateId;
                DeliveryChargeService.delDeliveryTemplate(deliveryTemplateId, function (err,data) {
                    if(err){
                        console.log(err)
                    }
                    else{
                        load($scope.currentPage);
                        console.log(data)
                    }
                })
            }
        });
        controllers.controller('AddDeliveryChargeCtrl',function ($scope,DeliveryChargeService,$stateParams,errMap,$state,validation,$q) {
            $scope.localImageIp=localImageIp;
            var cancelPil=function(){
                if(this && this.stopPropagation){
                    console.log("取消冒泡！！");
                    //W3C取消冒泡事件
                    this.stopPropagation();
                }else{
                    console.log("取消冒泡！！");
                    //IE取消冒泡事件
                    window.event.cancelBubble = true;
                }
            }
            $scope.deliveryTemplateId=$stateParams.deliveryTemplateId;
            console.log($scope.deliveryTemplateId);
            $scope.sendTime=[1,2];
            $scope.deliveryTemplate = {
                deliveryTemplateId: 0,
                deliveryTemplateName: '',
                frequence: 1,
                isShippingFree: 0,//是否包邮
                delivery_charge: '',//首件运费
                first_cases: 1,//首件数量
                step: 1,//增加的数量
                extra_charge: '',//增加的运费
            }
            $scope.shippingFreeTemplate={
                shippingFreeTemplateName:''
            }
            $scope.rules=[];  //运费规则的集合
            $scope.shippingRules=[];  //包邮规则的集合
            $scope.isShippingFree=false;
            var wait_del={
                areas:[],
                provinces:[],
                cities:[]
            }
            var wait_save={
                areas:[],
                provinces:[],
                cities:[]
            }
            $scope.rule_id=-1;//判断城市在第几次被选中,运费规则
            $scope.shippingRule_id=-1;//包邮规则
            //添加运费规则
            $scope.addRules = function () {   //添加运费规则
                $scope.rule_id++;
                var rule={
                    rule_id:$scope.rule_id,   //新加的规则是第几条规则
                    areas_name	: '未选择城市',
                    areas_id: '',
                    first_cases:1,
                    step:1,
                    first_charge:'',
                    extra_charge:'',
                    statue:1
                }
                $scope.rules.push(rule);
                $scope.china.forEach(function (item) {
                    item.province.forEach(function (province) {
                            province.visible = false;
                            province.myStyle={
                                "background-color" : "#ffffff"
                        }
                    })
                })
                console.log($scope.rule_id);
                console.log($scope.rules)
            }
            //添加包邮规则
            $scope.addShippingRules = function () {
                $scope.shippingRule_id++;
                var rule={
                    shippingRule_id:$scope.shippingRule_id,   //新加的规则是第几条规则
                    areas_name	: '未选择城市',
                    areas_id	: '',
                    isShippingFreeCondition:'',
                    statue:1
                }
                $scope.shippingRules.push(rule);
                $scope.china.forEach(function (item) {
                    item.province.forEach(function (province) {
                        province.visible = false;
                        province.myStyle={
                            "background-color" : "#ffffff"
                        }
                    })
                })
            }

            //id=1删除运费规则，id=2删除包邮规则
            $scope.del = function (index,id) {
                console.log($scope.china);

                if(id==1){
                    var wait_save={     //存储要删除的规则的地址信息
                        areas:[],
                        provinces:[],
                        cities:[]
                    }
                    $scope.rules[index].statue=0;
                    $scope.china.forEach(function (area) {
                        if(area.flag==true&&area.rule_id==$scope.rules[index].rule_id){
                            wait_save.areas.push(area) ;
                        }
                        area.province.forEach(function (pro) {
                            if(pro.flag==true&&pro.rule_id==$scope.rules[index].rule_id){
                                wait_save.provinces.push(pro)
                            }
                            $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                if(city.flag==true&&city.rule_id==$scope.rules[index].rule_id){
                                    wait_save.cities.push(city)
                                }
                            })
                        })
                    })

                    console.log(wait_save);

                    //将要删除的规则中的已选中的地区，均标记为未选中状态，并且rule_id设置为undefined，然后将其从rules数组中去除
                    wait_save.areas.forEach(function (area) {
                        area.flag=false;
                        area.rule_id=undefined;
                    })
                    wait_save.provinces.forEach(function (pro) {
                        pro.flag=false;
                        pro.rule_id=undefined;
                    })
                    wait_save.cities.forEach(function (city) {
                        city.flag=false;
                        city.rule_id=undefined;
                    })
                    $scope.rules.splice(index,1); 
                }
               if(id==2){
                   var shipping_wait_save={     //存储要删除的规则的地址信息
                       areas:[],
                       provinces:[],
                       cities:[]
                   }
                   $scope.china.forEach(function (area) {
                       if(area.shippingFlag==true&&area.shippingRule_id==$scope.shippingRules[index].shippingRule_id){
                           shipping_wait_save.areas.push(area) ;
                       }
                       area.province.forEach(function (pro) {
                           if(pro.shippingFlag==true&&pro.shippingRule_id==$scope.shippingRules[index].shippingRule_id){
                               shipping_wait_save.provinces.push(pro)
                           }
                           $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                               if(city.shippingFlag==true&&city.shippingRule_id==$scope.shippingRules[index].shippingRule_id){
                                   shipping_wait_save.cities.push(city)
                               }
                           })
                       })
                   })
                   console.log( shipping_wait_save);
                   shipping_wait_save.areas.forEach(function (area) {
                       area.shippingFlag=false;
                       area.shippingRule_id=undefined;
                   })
                   shipping_wait_save.provinces.forEach(function (pro) {
                       pro.shippingFlag=false;
                       pro.shippingRule_id=undefined;
                   })
                   shipping_wait_save.cities.forEach(function (city) {
                       city.shippingFlag=false;
                       city.shippingRule_id=undefined;
                   })
                   $scope.shippingRules.splice(index,1);
               }

            }
          /*  DeliveryChargeService.getProvinces(function (err,data) {
                if(err){
                    alert(err)
                }
                else{
                    console.log(data)
                    $scope.east_china={china_id:1,name:'华东',flag:false,shippingFlag:false,province:[{province_id:3,province_name:'上海',flag:false,shippingFlag:false},{province_id:7,province_name:'江苏',shippingFlag:false,flag:false},{province_id:18,province_name:'安徽',shippingFlag:false,flag:false},{province_id:19,province_name:'浙江',shippingFlag:false,flag:false},{province_id:23,province_name:'江西',shippingFlag:false,flag:false}]}
                    $scope.north_china={china_id:2,name:'华北',flag:false,shippingFlag:false,province:[{province_id:1,province_name:'北京',shippingFlag:false,flag:false},{province_id:4,province_name:'天津',shippingFlag:false,flag:false},{province_id:12,province_name:'山西',shippingFlag:false,flag:false},{province_id:17,province_name:'山东',shippingFlag:false,flag:false},{province_id:11,province_name:'河北',shippingFlag:false,flag:false},
                        {province_id:16,province_name:'内蒙古',shippingFlag:false,flag:false}]}
                    $scope.centra_china={china_id:3,name:'华中',flag:false,shippingFlag:false,province:[{province_id:21,province_name:'湖南',shippingFlag:false,flag:false},{province_id:8,province_name:'湖北',shippingFlag:false,flag:false},{province_id:13,province_name:'河南',shippingFlag:false,flag:false}]}
                    $scope.south_china={china_id:4,name:'华南',flag:false,shippingFlag:false,province:[{province_id:2,province_name:'广东',shippingFlag:false,flag:false},{province_id:22,province_name:'广西',shippingFlag:false,flag:false},{province_id:20,province_name:'福建',shippingFlag:false,flag:false},{province_id:27,province_name:'海南',shippingFlag:false,flag:false}]}
                    $scope.east_north_china={china_id:5,name:'东北',flag:false,shippingFlag:false,province:[{province_id:6,province_name:'辽宁',shippingFlag:false,flag:false},{province_id:14,province_name:'吉林',shippingFlag:false,flag:false},{province_id:15,province_name:'黑龙江',shippingFlag:false,flag:false}]}
                    $scope.west_north_china={china_id:6,name:'西北',flag:false,shippingFlag:false,province:[{province_id:10,province_name:'陕西',shippingFlag:false,flag:false},{province_id:31,province_name:'新疆',shippingFlag:false,flag:false},{province_id:28,province_name:'甘肃',shippingFlag:false,flag:false},
                        {province_id:29,province_name:'宁夏',shippingFlag:false,flag:false},{province_id:30,province_name:'青海',shippingFlag:false,flag:false}
                    ]}
                    $scope.west_south_china={china_id:7,name:'西南',flag:false,shippingFlag:false,province:[{province_id:5,province_name:'重庆',shippingFlag:false,flag:false},{province_id:25,province_name:'云南',shippingFlag:false,flag:false},{province_id:24,province_name:'贵州',shippingFlag:false,flag:false},
                        {province_id:26,province_name:'西藏',shippingFlag:false,flag:false},{province_id:9,province_name:'四川',shippingFlag:false,flag:false}
                    ]}
                    console.log(data)
                    $scope.china=[$scope.east_china,$scope.north_china,$scope.centra_china,$scope.south_china,$scope.east_north_china,$scope.west_north_china,$scope.west_south_china]
                    console.log($scope.china);
                }
            })*/
            $scope.china=DeliveryChargeService.getChina();
            console.log("$scope.china====>");
            console.log( $scope.china);
            $scope.cities=[];//所有的城市
            $scope.cities=DeliveryChargeService.getCities();
            console.log("$scope.cities====>");
            console.log($scope.cities);
      /*      DeliveryChargeService.getCities(function (err,data) {
                console.log('aaa')
                if(err){
                    alert(err)
                }
                else{
                    console.log(data)
                    for(var i=1;i<32;i++){
                        $scope.cities.push({province_id:i,cities:[]})
                    }
                  data.results.forEach(function (item) {
                      for(var i=0;i<$scope.cities.length;i++){
                          if($scope.cities[i].province_id==item.province_id){
                              item.flag=false;
                              item.shippingFlag=false;
                              $scope.cities[i].cities.push(item);
                              break;
                          }
                      }
                  })
                    console.log($scope.cities)
                }
            })*/
            //如果模板ID!=0查询模板信息，并设置$scope.rule_id和$scope.shippingRule_id
            if($scope.deliveryTemplateId!=0){
                DeliveryChargeService.getDeliveryTemplate($scope.deliveryTemplateId, function (err,data) {
                    if(err){
                        console.log(err);
                    }else{
                        $scope.deliveryTemplate=data;
                        console.log("打印出的运费模板运费规格数量");
                        console.log($scope.deliveryTemplate.rules.length);
                        console.log("打印出的运费模板包邮规格数量");
                        console.log($scope.deliveryTemplate.shippingRuleCount);
                        $scope.rule_id=$scope.deliveryTemplate.rules.length-1;  //保存后$scope.rule_id会被置为-1，会出现问题，所以在这里重置$scope.rule_id
                        $scope.shippingRule_id=$scope.deliveryTemplate.shippingRuleCount-1;
                        console.log("$scope.deliveryTemplate.isShippingFree="+$scope.deliveryTemplate.isShippingFree);
                        if($scope.deliveryTemplate.isShippingFree==0){
                            $scope.rules=data.rules;
                            console.log($scope.rules);
                            if($scope.rules.length>0){
                                for(var i=0;i<$scope.rules.length;i++){
                                    $scope.rules[i].rule_id=i;
                                }
                                $scope.rules.forEach(function(item){
                                    console.log(item.rule_id)
                                    $scope.current_rule_id=item.rule_id;
                                    var cities=item.areas_id.split(',');
                                    console.log(cities)
                                    cities.forEach(function (item) {
                                        var area;
                                        var pro;
                                        var city;
                                        var province_id;

                                        for(var i=0;i<$scope.cities.length;i++){
                                            var j=containCity($scope.cities[i].cities,parseInt(item));
                                            if(j==-1){
                                                continue;
                                            }
                                            else{
                                                city=j;
                                                city.flag=true;
                                                province_id=$scope.cities[i].province_id;
                                                break;
                                            }
                                        }
                                        var response=containProvince(province_id);
                                        pro=response.pro;
                                        area=response.area;
                                        $scope.selectCities(area,pro,city,1);
                                    })

                                })
                            }
                            console.log(data)
                        }

                    }
                })
                DeliveryChargeService.getShippingTemplate($scope.deliveryTemplateId, function (err,data) {
                    if(err){
                        console.log(err)
                    }else{
                        console.log('wwwww')
                        console.log(data)
                        console.log(typeof data.length==0)
                        if(data.length==0){
                            $scope.isShippingFree=false;
                        }
                        else{
                            $scope.shippingTemplate_id=data[0].shippingTemplate_id;
                            $scope.isShippingFree=true;
                            $scope.shippingFreeTemplate.shippingFreeTemplateName=data[0].shippingTemplate_name;
                            $scope.shippingRules=data[0].shippingRules;
                            console.log( $scope.shippingRules);
                           //初始包邮规则长度
                            $scope.startShippingRulesLength=$scope.shippingRules.length;
                            if($scope.shippingRules.length>0){
                                for(var i=0;i<$scope.shippingRules.length;i++){
                                    $scope.shippingRules[i].shippingRule_id=i;
                                }
                                $scope.shippingRules.forEach(function(item){
                                    console.log(item.shippingRule_id)
                                    $scope.current_rule_id=item.shippingRule_id;
                                    var cities=item.areas_id.split(',');
                                    console.log(cities)
                                    cities.forEach(function (item) {
                                        var area;
                                        var pro;
                                        var city;
                                        var province_id;

                                        for(var i=0;i<$scope.cities.length;i++){
                                            var j=containCity($scope.cities[i].cities,parseInt(item));
                                            if(j==-1){
                                                continue;
                                            }
                                            else{
                                                city=j;
                                                city.shippingFlag=true;
                                                province_id=$scope.cities[i].province_id;
                                                break;
                                            }
                                        }
                                        var response=containProvince(province_id);
                                        pro=response.pro;
                                        area=response.area;
                                        $scope.selectCities(area,pro,city,2);
                                    })
                                })
                            }
                        }
                    }
                })
            }

            var containCity = function (arr,value) {
             for(var i=0;i<arr.length;i++){
                 if(arr[i].city_id==value){
                     return arr[i];
                 }
             }
                return -1;
            }

            var contain = function (arr,value) {
                for(var i=0;i<arr.length;i++){
                    if(arr[i].province_id==value){
                        return arr[i];
                    }
                }
                return -1;
            }

            var containProvince = function (value) {
                var response={
                    pro:'',
                    area:''
                }
                for(var i=0;i< $scope.china.length;i++){
                    var j=contain($scope.china[i].province,value)
                    if(j==-1){
                        continue;
                    }
                    else{
                        response.pro=j;
                        response.area=$scope.china[i];
                        return response;
                    }
                }
            }

            $scope.loadProvince = function (index,id) {   //id=1时设置运费，id=2时设置包邮
                wait_del={
                    areas:[],
                    provinces:[],
                    cities:[]
                }
              wait_save={
                    areas:[],
                    provinces:[],
                    cities:[]
                }
                console.log(index);

                $scope.current_rule_id=index;
                $scope.china.forEach(function (item){
                    item.province.forEach(function (province) {
                        province.visible = false;
                        province.myStyle={
                            "background-color" : "#ffffff"
                        }
                    })
                })
                //先将当前所有flag为false的进行保存，以便取消时全置为false
                if(id==1){
                    $scope.china.forEach(function (area) {
                        if(area.flag==false){
                            wait_del.areas.push(area) ;
                            area.province.forEach(function (pro) {
                                if(pro.flag==false){
                                    wait_del.provinces.push(pro)
                                    $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                        if(city.flag==false){
                                            wait_del.cities.push(city)
                                        }
                                    })

                                }
                            })

                        }

                    })
                    $scope.china.forEach(function (area) {
                        if(area.flag==true&&area.rule_id==$scope.rules[$scope.current_rule_id].rule_id){
                            wait_save.areas.push(area);
                        }
                        area.province.forEach(function (pro) {
                            if(pro.flag==true&&pro.rule_id==$scope.rules[$scope.current_rule_id].rule_id){
                                wait_save.provinces.push(pro);
                            }
                            $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                if(city.flag==true&&city.rule_id==$scope.rules[$scope.current_rule_id].rule_id){
                                    wait_save.cities.push(city);
                                }
                            })
                        })
                    })
                    console.log("wait_save========>");
                    console.log(wait_save);
                    $('#provinceModal').modal();
                }
                if(id==2){

                    $scope.china.forEach(function (area) {
                        if(area.shippingFlag==false){
                            wait_del.areas.push(area) ;
                        }
                        area.province.forEach(function (pro) {
                            if(pro.shippingFlag==false){
                                wait_del.provinces.push(pro)
                            }
                            $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                if(city.shippingFlag==false){
                                    wait_del.cities.push(city)
                                }
                            })
                        })
                    })
                    $scope.china.forEach(function (area) {
                        if(area.shippingFlag==true&&area.shippingRule_id==$scope.shippingRules[$scope.current_rule_id].shippingRule_id){
                            wait_save.areas.push(area) ;
                        }
                        area.province.forEach(function (pro) {
                            if(pro.shippingFlag==true&&pro.shippingRule_id==$scope.shippingRules[$scope.current_rule_id].shippingRule_id){
                                wait_save.provinces.push(pro)
                            }
                            $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                if(city.shippingFlag==true&&city.shippingRule_id==$scope.shippingRules[$scope.current_rule_id].shippingRule_id){
                                    wait_save.cities.push(city)
                                }
                            })
                        })
                    })
                    $('#shippingModal').modal();
                }
                console.log(wait_save);
                console.log(wait_del);
            }

            $scope.selectAllProvince= function (item,id) {
                cancelPil();
                if(id==1){
                    if(item.flag==true){//解决选择被赋值问题
                        item.rule_id=$scope.rules[$scope.current_rule_id].rule_id;
                        item.province.forEach(function (pro) {

                            if(pro.rule_id==undefined||$scope.rules[$scope.current_rule_id].rule_id==pro.rule_id){
                                pro.flag=item.flag;
                                pro.rule_id=$scope.rules[$scope.current_rule_id].rule_id;
                            }
                            $scope.cities[pro.province_id-1].cities.forEach(function (city) {

                                if(city.rule_id==undefined||$scope.rules[$scope.current_rule_id].rule_id==city.rule_id){
                                    city.flag=item.flag;
                                    city.rule_id=$scope.rules[$scope.current_rule_id].rule_id
                                }

                            })
                        })
                    }
                    else{
                        item.rule_id=undefined;
                        item.province.forEach(function (pro) {

                            if(pro.rule_id==undefined||$scope.rules[$scope.current_rule_id].rule_id==pro.rule_id){
                                pro.flag=item.flag;
                                pro.rule_id=undefined;
                            }
                            $scope.cities[pro.province_id-1].cities.forEach(function (city) {

                                if(city.rule_id==undefined||$scope.rules[$scope.current_rule_id].rule_id==city.rule_id){
                                    city.flag=item.flag;
                                    city.rule_id=undefined
                                }

                            })
                        })
                    }
                }
                if(id==2){
                    if(item.shippingFlag==true){//解决选择被赋值问题
                        item.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id;
                        item.province.forEach(function (pro) {

                            if(pro.shippingRule_id==undefined||$scope.shippingRules[$scope.current_rule_id].shippingRule_id==pro.shippingRule_id){
                                pro.shippingFlag=item.shippingFlag;
                                pro.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id;
                            }
                            $scope.cities[pro.province_id-1].cities.forEach(function (city) {

                                if(city.shippingRule_id==undefined||$scope.shippingRules[$scope.current_rule_id].shippingRule_id==city.shippingRule_id){
                                    city.shippingFlag=item.shippingFlag;
                                    city.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id
                                }

                            })
                        })
                    }
                    else{
                        item.shippingRule_id=undefined;
                        item.province.forEach(function (pro) {

                            if(pro.shippingRule_id==undefined||$scope.rules[$scope.current_rule_id].shippingRule_id==pro.shippingRule_id){
                                pro.shippingFlag=item.shippingFlag;
                                pro.shippingRule_id=undefined;
                            }
                            $scope.cities[pro.province_id-1].cities.forEach(function (city) {

                                if(city.shippingRule_id==undefined||$scope.rules[$scope.current_rule_id].shippingRule_id==city.shippingRule_id){
                                    city.shippingFlag=item.shippingFlag;
                                    city.shippingRule_id=undefined
                                }

                            })
                        })
                    }
                }
               
            }

            $scope.selectProvince = function (area,item,id) {
                cancelPil();
                if(id==1){
                    var i=0;
                    area.province.forEach(function (pro) {
                        if(pro.flag==true){
                            i++
                        }
                    })
                    if(i!=area.province.length){
                        area.flag=false;
                        area.rule_id=undefined;

                    }
                    else{
                        area.rule_id=$scope.rules[$scope.current_rule_id].rule_id
                        area.flag=true;
                    }
                    if(item.flag==true){//解决选择后赋值问题
                        if(item.rule_id==undefined||$scope.rules[$scope.current_rule_id].rule_id==item.rule_id){
                            console.log(item.rule_id);
                            item.rule_id=$scope.rules[$scope.current_rule_id].rule_id;
                        }
                        $scope.cities[item.province_id-1].cities.forEach(function (city) {
                            console.log(city.rule_id)
                            if(city.rule_id==undefined||$scope.rules[$scope.current_rule_id].rule_id==city.rule_id){
                                city.flag=item.flag;
                                city.rule_id=$scope.rules[$scope.current_rule_id].rule_id
                            }
                        })
                    }
                    else{
                        if(item.rule_id==undefined||$scope.rules[$scope.current_rule_id].rule_id==item.rule_id){
                            console.log(item.rule_id);
                            item.rule_id=undefined;
                        }
                        $scope.cities[item.province_id-1].cities.forEach(function (city) {
                            console.log(city.rule_id)
                            if(city.rule_id==undefined||$scope.rules[$scope.current_rule_id].rule_id==city.rule_id){
                                city.flag=item.flag;
                                city.rule_id=undefined
                            }
                        })
                    }
                }
               if(id==2){
                   var i=0;
                   area.province.forEach(function (pro) {
                       if(pro.shippingFlag==true){
                           i++
                       }
                   })
                   if(i!=area.province.length){
                       area.shippingFlag=false;
                       area.shippingRule_id=undefined;

                   }
                   else{
                       area.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id
                       area.shippingFlag=true;
                   }
                   if(item.shippingFlag==true){//解决选择后赋值问题
                       if(item.shippingRule_id==undefined||$scope.shippingRules[$scope.current_rule_id].shippingRule_id==item.shippingRule_id){
                           console.log(item.shippingRule_id);
                           item.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id;
                       }
                       $scope.cities[item.province_id-1].cities.forEach(function (city) {
                           console.log(city.shippingRule_id)
                           if(city.shippingRule_id==undefined||$scope.shippingRules[$scope.current_rule_id].shippingRule_id==city.shippingRule_id){
                               city.shippingFlag=item.shippingFlag;
                               city.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id
                           }
                       })
                   }
                   else{
                       if(item.shippingRule_id==undefined||$scope.shippingRules[$scope.current_rule_id].shippingRule_id==item.shippingRule_id){
                           console.log(item.shippingRule_id);
                           item.shippingRule_id=undefined;
                       }
                       $scope.cities[item.province_id-1].cities.forEach(function (city) {
                           console.log(city.shippingRule_id)
                           if(city.shippingRule_id==undefined||$scope.shippingRules[$scope.current_rule_id].shippingRule_id==city.shippingRule_id){
                               city.shippingFlag=item.shippingFlag;
                               city.shippingRule_id=undefined
                           }
                       })
                   }
               }
            }
            $scope.selectCities = function (area,pro,city,id) {
                cancelPil();
                if(id==1){
                    var i=0;
                    $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                        if(city.flag==true){
                            i++
                        }
                    })
                    if(i!=$scope.cities[pro.province_id-1].cities.length){
                        pro.flag=false;
                        pro.rule_id=undefined;//相当于执行了selectProvince的false情况
                    }
                    else{
                        pro.rule_id=$scope.rules[$scope.current_rule_id].rule_id;
                        pro.flag=true;
                    }
                    var j=0;
                    area.province.forEach(function (pro) {
                        if(pro.flag==true){
                            j++;
                        }
                    })
                    if(j!=area.province.length){
                        area.flag=false;
                        area.rule_id=undefined;
                    }
                    else{
                        area.rule_id=$scope.rules[$scope.current_rule_id].rule_id;
                        area.flag=true;
                    }
                    if(city.flag==true){
                        city.rule_id=$scope.rules[$scope.current_rule_id].rule_id;
                    }
                    else{
                        city.rule_id=undefined;
                    }
                }
             if(id==2){
                 var i=0;
                 $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                     if(city.shippingFlag==true){
                         i++
                     }
                 })
                 if(i!=$scope.cities[pro.province_id-1].cities.length){
                     pro.shippingFlag=false;
                     pro.shippingRule_id=undefined;//相当于执行了selectProvince的false情况
                 }
                 else{
                     pro.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id;
                     pro.shippingFlag=true;
                 }
                 var j=0;
                 area.province.forEach(function (pro) {
                     if(pro.shippingFlag==true){
                         j++;
                     }
                 })
                 if(j!=area.province.length){
                     area.shippingFlag=false;
                     area.shippingRule_id=undefined;
                 }
                 else{
                     area.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id;
                     area.shippingFlag=true;
                 }
                 if(city.shippingFlag==true){
                     city.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id;
                 }
                 else{
                     city.shippingRule_id=undefined;
                 }
             }

            }
             //   $scope.visible = false;
            $scope.toggle = function (pro) {
                cancelPil();
                    pro.myStyle={
                        "background-color" : "#ffffff"
                    }
                    $scope.china.forEach(function (item) {
                        item.province.forEach(function (province) {
                            if(pro!=province){
                                province.visible = false;
                                province.myStyle={
                                    "background-color" : "#ffffff"
                                }
                            }
                        })
                    })
                    pro.visible = !pro.visible;
                    if(pro.visible){
                        pro.myStyle={
                            "background-color" : "#ffffc7"
                        }
                    }
                }

            $scope.saveCities =function(id){

                var cities_to_string='';
                var cities_id_to_string='';
                if(id==1){
                    $scope.rules[$scope.current_rule_id].areas_name='';
                    $scope.china.forEach(function (item) {
                        if(item.flag==true){
                                var provinces=[];
                                var i=0;
                                //$scope.rules[$scope.current_rule_id].areas_name+=item.name+',';
                                item.province.forEach(function (pro) {
                                        provinces.push({province_name:pro.province_name,province_id:pro.province_id})
                                        var cities=[];
                                        var cities_id=[];
                                        $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                            if(city.rule_id==$scope.rules[$scope.current_rule_id].rule_id&&city.flag==true){
                                                cities.push(city.city_name)
                                                cities_id.push(city.city_id)
                                            }
                                        })
                                        provinces[i].cities=cities
                                        if(cities.length>0){
                                            cities_to_string+=cities.join(',')+",";
                                            cities_id_to_string+=cities_id.join(',')+",";
                                        }
                                        i++;
                                })
                                    var j=0;
                                    console.log(provinces)
                                    provinces.forEach(function (pro) {
                                        console.log(pro)
                                        console.log(pro.cities.length)
                                        console.log(pro.cities.length==$scope.cities[pro.province_id-1].cities.length)
                                        if(pro.cities.length==$scope.cities[pro.province_id-1].cities.length){
                                            console.log("j  "+j);
                                            j++;
                                        }
                                    })

                                    console.log("provinces.length"+provinces.length)
                                    if(j==provinces.length){
                                        $scope.rules[$scope.current_rule_id].areas_name+=item.name+',';
                                    }
                                    else{
                                        provinces.forEach(function (pro) {
                                            if(pro.cities.length==$scope.cities[pro.province_id-1].cities.length){
                                                $scope.rules[$scope.current_rule_id].areas_name+=pro.province_name+",";
                                            }
                                            else{
                                                if(pro.cities.length>0){
                                                    $scope.rules[$scope.current_rule_id].areas_name+=pro.cities.join(",")+",";
                                                }

                                            }
                                        })
                                    }

                            }
                        else {
                            item.province.forEach(function (pro) {
                                if(pro.flag==true){
                                    var province=pro.province_name;
                                        var cities=[]
                                        var cities_id=[]
                                        $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                            if(city.rule_id==$scope.rules[$scope.current_rule_id].rule_id&&city.flag==true){
                                                cities.push(city.city_name)
                                                cities_id.push(city.city_id)
                                            }
                                        })
                                        if(cities.length>0){
                                            cities_to_string+=cities.join(',')+",";
                                            cities_id_to_string+=cities_id.join(',')+",";
                                        }

                                        console.log("cities.length==$scope.cities[pro.province_id].cities.length"+cities.length==$scope.cities[pro.province_id-1].cities.length)
                                        if(cities.length==$scope.cities[pro.province_id-1].cities.length){
                                            $scope.rules[$scope.current_rule_id].areas_name+=province+',';
                                        }
                                        else{
                                            if(cities.length>0){
                                                $scope.rules[$scope.current_rule_id].areas_name+=cities.join(",")+',';
                                            }
                                        }
                                }
                                else{
                                    var cities=[];
                                    var cities_id=[];
                                    $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                        if(city.flag==true&&city.rule_id==$scope.rules[$scope.current_rule_id].rule_id){
                                            $scope.rules[$scope.current_rule_id].areas_name+=city.city_name+',';
                                            cities.push(city.city_name)
                                            cities_id.push(city.city_id)
                                        }
                                    })
                                    if(cities.length>0){
                                        cities_to_string+=cities.join(',')+",";
                                        cities_id_to_string+=cities_id.join(',')+",";
                                    }
                                }
                            })
                        }
                    })
                    cities_id_to_string=cities_id_to_string.substring(0,cities_id_to_string.length-1);
                    $scope.rules[$scope.current_rule_id].areas_name=$scope.rules[$scope.current_rule_id].areas_name.substring(0,$scope.rules[$scope.current_rule_id].areas_name.length-1);
                    $scope.rules[$scope.current_rule_id].areas_id=cities_id_to_string;
                    console.log($scope.rules[$scope.current_rule_id].areas_id);

                }
                if(id==2){
                    $scope.shippingRules[$scope.current_rule_id].areas_name='';
                    $scope.china.forEach(function (item) {
                        /*     if($scope.current_rule_id<$scope.shippingRule_id){
                         if(item.shippingFlag==true){
                         $scope.shippingRules[$scope.current_rule_id].areas_name+=item.name+',';
                         item.province.forEach(function (pro) {
                         var province=pro.province_name;
                         var cities=[]
                         $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                         cities.push(city.city_name)
                         })
                         cities_to_string=province+','+cities.join(',')+';';
                         })
                         }
                         else {
                         item.province.forEach(function (pro) {
                         if(pro.shippingFlag==true){
                         $scope.shippingRules[$scope.current_rule_id].areas_name+=pro.province_name+',';
                         var province=pro.province_name;
                         var cities=[]
                         $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                         cities.push(city.city_name)
                         })
                         cities_to_string=province+','+cities.join(',')+';';
                         }
                         else{

                         var province=pro.province_name;
                         var cities=[]
                         $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                         if(city.shippingFlag==true){
                         $scope.shippingRules[$scope.current_rule_id].areas_name+=city.city_name+',';
                         cities.push(city.city_name)
                         }
                         })
                         cities_to_string=province+','+cities.join(',')+';';
                         }
                         })
                         }

                         }*/

                        if(item.shippingFlag==true){
                                var provinces=[];
                                var i=0;
                                //$scope.shippingRules[$scope.current_rule_id].areas_name+=item.name+',';
                                item.province.forEach(function (pro) {

                                        provinces.push({province_name:pro.province_name,province_id:pro.province_id})
                                        var province=pro.province_name;
                                        var cities=[];
                                        var cities_id=[]
                                        $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                            if(city.shippingRule_id==$scope.shippingRules[$scope.current_rule_id].shippingRule_id&&city.shippingFlag==true){
                                                cities.push(city.city_name)
                                                cities_id.push(city.city_id)
                                            }
                                        })
                                        provinces[i].cities=cities
                                        if(cities.length>0){
                                            cities_to_string+=cities.join(',')+",";
                                            cities_id_to_string+=cities_id.join(',')+",";
                                        }
                                        i++;

                                })
                                    var j=0;
                                    console.log(provinces)
                                    provinces.forEach(function (pro) {
                                        console.log(pro)
                                        console.log(pro.cities.length)
                                        console.log(pro.cities.length==$scope.cities[pro.province_id-1].cities.length)
                                        if(pro.cities.length==$scope.cities[pro.province_id-1].cities.length){
                                            console.log("j  "+j);
                                            j++;
                                        }
                                    })

                                    console.log("provinces.length"+provinces.length)
                                    if(j==provinces.length){
                                        $scope.shippingRules[$scope.current_rule_id].areas_name+=item.name+',';
                                    }
                                    else{
                                        provinces.forEach(function (pro) {
                                            if(pro.cities.length==$scope.cities[pro.province_id-1].cities.length){
                                                $scope.shippingRules[$scope.current_rule_id].areas_name+=pro.province_name+",";
                                            }
                                            else{
                                                if(pro.cities.length>0){
                                                    $scope.shippingRules[$scope.current_rule_id].areas_name+=pro.cities.join(",")+",";
                                                }

                                            }
                                        })
                                    }
                        }
                        else {
                            item.province.forEach(function (pro) {
                                if(pro.shippingFlag==true){
                                        var province=pro.province_name;
                                        var cities=[]
                                        var cities_id=[]
                                        $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                            if(city.shippingRule_id==$scope.shippingRules[$scope.current_rule_id].shippingRule_id&&city.shippingFlag==true){
                                                cities.push(city.city_name)
                                                cities_id.push(city.city_id)
                                            }
                                        })
                                        if(cities.length>0){
                                            cities_to_string+=cities.join(',')+",";
                                            cities_id_to_string+=cities_id.join(',')+",";
                                        }

                                        console.log("cities.length==$scope.cities[pro.province_id].cities.length"+cities.length==$scope.cities[pro.province_id-1].cities.length)
                                        if(cities.length==$scope.cities[pro.province_id-1].cities.length){
                                            $scope.shippingRules[$scope.current_rule_id].areas_name+=province+',';
                                        }
                                        else{
                                            if(cities.length>0){
                                                $scope.shippingRules[$scope.current_rule_id].areas_name+=cities.join(",")+',';
                                            }
                                        }
                                }
                                else{
                                    var cities=[];
                                    var cities_id=[];
                                    $scope.cities[pro.province_id-1].cities.forEach(function (city) {
                                        if(city.shippingFlag==true&&city.shippingRule_id==$scope.shippingRules[$scope.current_rule_id].shippingRule_id){
                                            $scope.shippingRules[$scope.current_rule_id].areas_name+=city.city_name+',';
                                            cities.push(city.city_name)
                                            cities_id.push(city.city_id)
                                        }
                                    })
                                    if(cities.length>0){
                                        cities_to_string+=cities.join(',')+",";
                                        cities_id_to_string+=cities_id.join(',')+",";
                                    }
                                }
                            })
                        }
                    })
                    cities_id_to_string=cities_id_to_string.substring(0,cities_id_to_string.length-1);
                    $scope.shippingRules[$scope.current_rule_id].areas_name=$scope.shippingRules[$scope.current_rule_id].areas_name.substring(0,$scope.shippingRules[$scope.current_rule_id].areas_name.length-1);
                    $scope.shippingRules[$scope.current_rule_id].areas_id=cities_id_to_string;
                }

                console.log($scope.deliveryTemplate);

            }
            
            $scope.cancel = function (id) {
                if(id==1){
                    wait_del.areas.forEach(function (area) {
                        area.flag=false;
                        area.rule_id=undefined;
                    })
                    wait_del.provinces.forEach(function (pro) {
                        pro.flag=false;
                        pro.rule_id=undefined;
                    })
                    wait_del.cities.forEach(function (city) {
                        city.flag=false;
                        city.rule_id=undefined;
                    })
                    wait_save.areas.forEach(function (area) {
                        area.flag=true;
                        area.rule_id=$scope.rules[$scope.current_rule_id].rule_id;
                    })
                    wait_save.provinces.forEach(function (pro) {
                        pro.flag=true;
                        pro.rule_id=$scope.rules[$scope.current_rule_id].rule_id;
                    })
                    wait_save.cities.forEach(function (city) {
                        city.flag=true;
                        city.rule_id=$scope.rules[$scope.current_rule_id].rule_id;
                    })
                }
                 if(id==2){
                     wait_del.areas.forEach(function (area) {
                         area.shippingFlag=false;
                         area.shippingRule_id=undefined;
                     })
                     wait_del.provinces.forEach(function (pro) {
                         pro.shippingFlag=false;
                         pro.shippingRule_id=undefined;
                     })
                     wait_del.cities.forEach(function (city) {
                         city.shippingFlag=false;
                         city.shippingRule_id=undefined;
                     })
                     wait_save.areas.forEach(function (area) {
                         area.shippingFlag=true;
                         area.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id;
                     })
                     wait_save.provinces.forEach(function (pro) {
                         pro.shippingFlag=true;
                         pro.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id;
                     })
                     wait_save.cities.forEach(function (city) {
                         city.shippingFlag=true;
                         city.shippingRule_id=$scope.shippingRules[$scope.current_rule_id].shippingRule_id;
                     })
                 }
            }

            var errMap =errMap.getMap();
            var checkValidation = function () {

                var templatelegal=validation.checkTempletaName( $scope.deliveryTemplate.deliveryTemplateName);
                var initCasesLegal=validation.checkInitCases($scope.deliveryTemplate.first_cases);
                var initChargeLegal=validation.checkInitCharge($scope.deliveryTemplate.delivery_charge);
                var addCasesLegal=validation.checkStepCases($scope.deliveryTemplate.step);
                var addChargeLegal=validation.checkStepCharge($scope.deliveryTemplate.extra_charge);
                var shippingTemplateLegal =validation.checkShippingTempletaName( $scope.shippingFreeTemplate.shippingFreeTemplateName);
                var firstCasesLegal;
                var firstChargeLegal;
                var continueCasesLegal;
                var continueChargeLegal;
                var citiesLegal;
                var shippingConditionLegal;
                var shippingCitiesLegal;
                $scope.rules.forEach(function (item) {
                    var firstCasesItemLegal=validation.checkFirstCases(item.first_cases);
                    var firstChargeItemLegal=validation.checkFirstCharge(item.first_charge);
                    var continueCasesItemLegal=validation.checkContinueCases(item.step);
                    var continueChargeItemLegal=validation.checkContinueCharge(item.extra_charge);
                    var citiesItemLegal=validation.checkCities(item.areas_name);
                    if(firstCasesItemLegal){
                        firstCasesLegal=firstCasesItemLegal
                    }
                    if(firstChargeItemLegal){
                        firstChargeLegal=firstChargeItemLegal
                    }
                    if(continueCasesItemLegal){
                        continueCasesLegal=continueCasesItemLegal
                    }
                    if(continueChargeItemLegal){
                        continueChargeLegal=continueChargeItemLegal
                    }
                    if(citiesItemLegal){
                        citiesLegal=citiesItemLegal;
                    }
                })
                $scope.shippingRules.forEach(function (item) {
                  var condition=validation.checkShippingCondition(item.isShippingFreeCondition);
                    var citiesItemLegal=validation.checkCities(item.areas_name);
                    if(condition){
                        shippingConditionLegal=condition
                    }
                    if(citiesItemLegal){
                        shippingCitiesLegal=citiesItemLegal;
                    }
                })
                if($scope.deliveryTemplate.isShippingFree==1){
                    var arr=[templatelegal,initCasesLegal,initChargeLegal,addCasesLegal,addChargeLegal];
                }
               else if($scope.isShippingFree==false){
                    var arr=[templatelegal,initCasesLegal,initChargeLegal,addCasesLegal,addChargeLegal,citiesLegal,firstCasesLegal,firstChargeLegal,continueCasesLegal,continueChargeLegal];
                }
                else{
                    var arr=[templatelegal,initCasesLegal,initChargeLegal,addCasesLegal,addChargeLegal,citiesLegal,firstCasesLegal,firstChargeLegal,continueCasesLegal,continueChargeLegal,shippingTemplateLegal,shippingCitiesLegal,shippingConditionLegal];
                }
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
            $scope.goBack = function () {
                $state.go('home.delivery_charge');
            }
            $scope.editor = function () {
                //$scope.isShippingFree，true表示勾选了包邮模板，false表示没有勾选包邮模板
                console.log($scope.isShippingFree);
                $scope.deliveryTemplate.deliveryTemplateId=$scope.deliveryTemplateId;
                //$scope.shippingFreeTemplate.shippingTemplate_id=$scope.deliveryTemplateId;
                console.log($scope.deliveryTemplate);
                console.log($scope.shippingFreeTemplate);
                //包邮规则的处理====>1.先无后无，不作处理;2.先无后有，保存操作3.先有后无，删除包邮模板和包邮规则(暂不支持)4.先有后有，删除原有的包邮规则，添加现有的包邮规则
                console.log("初始包邮规则的长度");
                console.log($scope.startShippingRulesLength);
                console.log("现在的包邮规则长度");
                console.log($scope.shippingRules.length);

                var res=checkValidation();
                if(res){
                    alert(errMap[res]);
                    return ;
                }
                DeliveryChargeService.isDeliveryTemplateNmaeExsit($scope.deliveryTemplate, function (err,data) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(data)
                        if (data == "yes") {
                            alert("该模板名称已经存在，请重新命名")
                        } else {
                            //更新运费模板,同时删除原有规则
                            DeliveryChargeService.updateDeliveryTemplate($scope.deliveryTemplate, function (err,data) {
                                if(err){
                                    console.log(err)
                                }else{
                                    console.log("成功更新运费模板");
                                    console.log(data)
                                    console.log($scope.rules);
                                    if($scope.rules.length>0) {
                                        $scope.rules.forEach(function (item) {
                                            item.insertId = $scope.deliveryTemplateId
                                        })
                                        //添加运费规则
                                        DeliveryChargeService.addRules($scope.rules, function (err,data) {
                                            if(err){
                                                console.log(err)
                                            }else{
                                                console.log("成功添加运费规则");
                                                console.log(data);
                                                if($scope.isShippingFree==true){
                                                    console.log("勾选了包邮模板");
                                                    $scope.shippingFreeTemplate.shippingTemplate_id=$scope.shippingTemplate_id;
                                                    if($scope.shippingRules.length>0) {
                                                        $scope.shippingRules.forEach(function (item) {
                                                            item.insertId = $scope.shippingTemplate_id
                                                        })
                                                        //包邮规则的处理====>
                                                        // 1.先无后无，不作处理;
                                                        // 2.先无后有，保存操作
                                                        // 3.先有后无，删除包邮模板和包邮规则(暂不支持)
                                                        // 4.先有后有，删除原有的包邮规则，添加现有的包邮规则

                                                        DeliveryChargeService.updateShippingTemplate($scope.shippingFreeTemplate, function (err,data) {
                                                            if(err){
                                                                console.log(err)
                                                            }else{
                                                                console.log(data)
                                                                DeliveryChargeService.addShippingRules($scope.shippingRules, function (err,data) {
                                                                    if(err){
                                                                        console.log(err)
                                                                    }else{
                                                                        $state.go('home.delivery_charge');
                                                                        console.log(data)
                                                                    }
                                                                })

                                                            }
                                                        })
                                                    }

                                                }
                                                else{
                                                    $state.go('home.delivery_charge');
                                                }
                                            }
                                        })
                                    }
                                    else{
                                        $state.go('home.delivery_charge');
                                    }

                                }
                            })
                        }
                    }
                })


            }

            $scope.save = function () {
                if($scope.deliveryTemplate.isShippingFree==1){
                    DeliveryChargeService.isDeliveryTemplateNmaeExsit($scope.deliveryTemplate, function (err,data) {
                        if(err){
                            console.log(err)
                        }else{
                            console.log(data)
                            if(data=="yes"){
                                alert("该模板名称已经存在，请重新命名")
                            }else{
                                DeliveryChargeService.addDeliveryTemplate($scope.deliveryTemplate, function (err,data) {
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log('aaaaaaaaaaaa')
                                        $state.go('home.delivery_charge');
                                        console.log(data);
                                    }
                                })
                            }
                        }
                    })

                }else{
                    DeliveryChargeService.isDeliveryTemplateNmaeExsit($scope.deliveryTemplate, function (err,data) {
                        if(err){
                            console.log(err)
                        }else{
                            console.log(data);
                            if(data=="yes"){
                                alert("该模板名称已经存在，请重新命名")
                            }
                            else{
                                var res=checkValidation();
                                if(res){
                                    alert(errMap[res]);
                                }
                                else{
                                    DeliveryChargeService.addDeliveryTemplate($scope.deliveryTemplate, function (err,data) {
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            console.log('ssss')
                                            console.log(data);
                                            if($scope.rules.length>0){
                                                $scope.rules.forEach(function (item) {
                                                    item.insertId=data.insertId
                                                })
                                                DeliveryChargeService.addRules($scope.rules,function(err,data){
                                                    if(err){
                                                        console.log(err)
                                                    }else{
                                                        console.log(data)
                                                    }
                                                })
                                            }
                                            if($scope.isShippingFree){
                                                $scope.shippingFreeTemplate.deliveryTemplateId=data.insertId;
                                                DeliveryChargeService.addShippingTemplate($scope.shippingFreeTemplate, function (err,data) {
                                                    if(err){
                                                        console.log(err)
                                                    }else{
                                                        console.log(data)
                                                        if($scope.shippingRules.length>0){
                                                            $scope.shippingRules.forEach(function (item) {
                                                                item.insertId=data.insertId
                                                            })
                                                            $scope.shippingRules=JSON.stringify($scope.shippingRules);
                                                            DeliveryChargeService.addShippingRules($scope.shippingRules, function (err,data) {
                                                                if(err){
                                                                    console.log(err)
                                                                }else{
                                                                    console.log(data)
                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                            $state.go('home.delivery_charge');
                                        }
                                    })
                                }
                            }
                        }
                    })

                }


            }

            $scope.hideAll=function(){   //点击空白处下拉框消失，需要在其他区域取消冒泡

                $scope.china.forEach(function (item) {
                    item.province.forEach(function (province) {
                        province.myStyle={
                            "background-color" : "#ffffff"
                        }
                        province.visible=false;
                    })
                })

            }

        });
    });
