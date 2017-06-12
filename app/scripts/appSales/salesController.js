/**
 * Created by younong-3 on 2016/4/12.
 */
/**
 * Created by wei on 16/1/12.
 */



define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('SalesCtrl',function ($scope,SalesService,validation,errMap,$state) {
            $scope.localImageIp=localImageIp
            $scope.orderStatue=[
                {company_goods_status_id:'2',company_goods_status_name:'已上架商品',select:true,type:'0',audit:0},
                {company_goods_status_id:'2',company_goods_status_name:'自主促销商品',select:false,type:'1,2,3',audit:1},
                {company_goods_status_id:'2',company_goods_status_name:'待审核活动商品',select:false,type:'1,2,3',audit:2},
                {company_goods_status_id:'2',company_goods_status_name:'活动商品',select:false,type:'1,2,3',audit:3}
                ];
            $('#discountModaldpStart, #discountModaldpEnd').datepicker({});
            $('#dpStart, #dpEnd').datepicker({});
            var errMap=errMap.getMap();
            $scope.conditionParams = {
                dateStart:'',
                dateEnd:'',
                company_goods_status_id:'',
                company_goods_name:''
            }
            $scope.goods=[];
            $scope.activity_type={activity_id:0,activity_name:'不参加'};
            $scope.activity_type_all=[];
            $scope.limit_buy_all=['否','是'];
            $scope.limit_buy='否';
            $scope.promotion_type='正常销售';
            $scope.promotion_type_all=['正常销售','直降促销','打折促销','买一送一'];
            $scope.company_sku_select=[];
            $scope.discountRate={};
            $scope.input_data=[];
            $scope.sales_promotion_type='';
            $scope.params ={company_goods_status_id:2,page:1,size:10,sales_promotion:0,isPromotionModule:true,type:'0',audit:0};
            $scope.point=[];
            $scope.count = 0;
            $scope.currentPage = 1;
            $scope.numPages = 1;
            $scope.pageSize = 10;
            $scope.pages = [];
            $scope.pageStart = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.pageEnd = $scope.pageSize;
            $scope.dialogCurrentPage=1;
            $scope.dialogPageStart = ($scope.dialogCurrentPage - 1) * 3 + 1;
            $scope.dialogPageEnd = 3;
            $scope.dialogPages=[];
            $scope.dialogPage=1;
            $scope.dialogPageCount=1
            $scope.conditionParams.company_goods_status_id=$scope.params.company_goods_status_id;
          $scope.goodsCollection=[];
            $scope.skuCollection=[];
            $scope.gift_sku_selected={};
            $scope.company_sku_selected={};
            $scope.company_goods_selected={};
            $scope.gift_number=1;
            $scope.goods_item={}
            $scope.skuCollectionArray=[];
            $scope.activitiesDescripe=[];
            //对话框的每页元素
            $scope.skuArrItems=[];
            $scope.promotion_type_save=''
            $scope.flag=true;//用于解决弹框重复出现
            $scope.activity_icon_flag=false;//用于解决判断是否有参加活动的规格，用于显示活动logo
            var waitDelImg={
                icon:[],
                img:[]
            };
            $scope.files=[];
            $scope.selectPromotion =function(index,promotion_type){
                if( promotion_type=='直降促销'){
                    $scope.specialPrice(index,1);
                    $scope.promotion_type_save=promotion_type;
                    $scope.flag=true;
                    $scope.activity_icon_flag=false;
                }
                if(promotion_type=='打折促销'){
                     $scope.discount(index,1);
                    $scope.promotion_type_save=promotion_type;
                    $scope.flag=true;
                    $scope.activity_icon_flag=false;
                }
                if(promotion_type=='买一送一'){
                    $scope.gift(index,1);
                    $scope.activity_icon_flag=false;
                    $scope.promotion_type_save=promotion_type;
                    $scope.flag=true;
                }
            }
              $scope.activityDescripe = function () {
                  $scope.activitiesDescripeForPage=[];
                  if(4<$scope.activitiesDescripe.length){
                      for(var i=0;i<4;i++){
                          $scope.activitiesDescripeForPage[i]=$scope.activitiesDescripe[i];
                      }
                  }
                  else{
                      for(var i=0;i<$scope.activitiesDescripe.length;i++){
                          $scope.activitiesDescripeForPage[i]=$scope.activitiesDescripe[i];
                      }
                  }
                $('#ActivityModal').modal();
                }
//HEAD
          /*  $scope.confirmActivityDescripe = function () {
                $('#ActivityModal').modal('hide');
            }*/
            $scope.limitBuyChg = function (sku) {
                ///ssssssssssss
                if(sku.limit_buy=="否"){
                    sku.limit_buy_number=0;
                    sku.company_goods_sku_buy_number=0;
                    //
                }
            }
//
            $scope.onActivitySelectPage = function (page) {
                $scope.dialogCurrentPage=page;
                $scope.activitiesDescripeForPage=[];
                if(parseInt(page)*4<$scope.activitiesDescripe.length){
                    for(var i=0;i<4;i++){
                        $scope.activitiesDescripeForPage[i]=$scope.activitiesDescripe[parseInt(($scope.dialogCurrentPage-1)*4)+i];
                    }
                }
              else{
                    for(var i=0;i<$scope.activitiesDescripe.length-parseInt(page-1)*4;i++){
                        $scope.activitiesDescripeForPage[i]=$scope.activitiesDescripe[parseInt(($scope.dialogCurrentPage-1)*4)+i];
                    }
//yunfei
                }
            }
            var getActivity = function(){
                SalesService.getActivity().then(function (data) {
                  for(var i in data.result){
                      console.log(typeof(parseInt(i)));
                      $scope.activitiesDescripe[i]=data.result[i];
                      $scope.activity_type_all[parseInt(i)+1]=data.result[i];
                  }
                    console.log($scope.activitiesDescripe);
                    $scope.dialogPageCount=($scope.activitiesDescripe.length-1)/4+1;
                    console.log($scope.dialogPageCount);
                    $scope.activity_type_all[0]=$scope.activity_type;
                    console.log($scope.activity_type_all);
                }, function (err) {
                    console.log(err);
                })
            }
            getActivity();

            var load =function(params) {
                console.log(params);
                params.page = $scope.currentPage;
                params.size = $scope.pageSize;
              SalesService.getCompanyGoods(params).then(function (data) {
                    console.log(data);
                  var j=0;
                  $scope.goods=[];
                  for(var i in data.array){
                      if(data.array[i].skuArr.length!=0){
                          $scope.goods[j]=data.array[i];
                          j++;
                      }
                  }
                  j=0;
                  console.log($scope.goods)
                  if($scope.goods.length>0){
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
                      $scope.count=data.counts;
                      $scope.numPages = data.counts > 0 ? Math.ceil(data.counts / $scope.pageSize) : 1;
                      $scope.pageStart = data.counts > 0 ? ($scope.currentPage - 1) * $scope.pageSize + 1 : 0;
                      $scope.pageEnd = $scope.pageSize * $scope.currentPage > data.counts ? data.counts : $scope.currentPage * $scope.pageSize;
                  }
                  else{
                      $scope.count=0;
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

            $scope.lookUp=function(){

                $scope.currentPage = 1;
                load($scope.params);
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
            $scope.loadByCondition = function(){
                $scope.company_goods_name='';
                $scope.currentPage = 1;
                $scope.conditionParams.dateStart = $("#dpStart").val();
                $scope.conditionParams.dateEnd = $("#dpEnd").val();
                $scope.params = $.extend($scope.params,$scope.conditionParams);
                console.log($scope.params);

                load($scope.params);
            }
            $scope.loadByGoodsName=function(){
                $scope.currentPage = 1;
                load({company_goods_status_id:0,page:1,size:10,company_goods_name:$scope.company_goods_name});
            }

            var item_id;

            $scope.gift=function(index,page){
                item_id=index;
                $scope.activity_type='';
                $scope.goods[item_id].skuArr.forEach(function(item){
                    if(item!=null){
                        SalesService.updateSalePrice(item).then(function (data) {
                            console.log(data);
                        }, function (err) {
                            console.log(err);
                        })
                    }
                })
                $scope.goods_item=$scope.goods[index];
                if($scope.goods_item.company_goods_activity_icon){
                    $scope.covers= IconIp+$scope.goods_item.company_goods_activity_icon;
                    console.log($scope.covers);
                }
                $scope.dialogPageCount=($scope.goods_item.skuArr.length-1)/3+1;
                console.log($scope.dialogPageCount)
               /* for (var i = 1; i <= $scope.dialogPageCount; i++) {
                    $scope.dialogPages.push(i);
                }*/
                console.log($scope.dialogPages)
                if(parseInt(page)*3<$scope.goods_item.skuArr.length){
                    for (var i = 0; i < 3; i++) {
                        $scope.skuArrItems[i]=$scope.goods_item.skuArr[(parseInt(page)-1)*3+i];
                    }
                }
                else{
                    $scope.skuArrItems=[];
                    for (var i = 0; i < ($scope.goods_item.skuArr.length-(parseInt(page)-1)*3); i++) {
                        $scope.skuArrItems[i]=$scope.goods_item.skuArr[(parseInt(page)-1)*3+i];
                    }
                }
                $scope.dialogPageStart =($scope.dialogCurrentPage - 1) * 3 + 1 ;
                $scope.dialogPageEnd = parseInt(page)*3<$scope.goods_item.skuArr.length? parseInt(page)*3 :$scope.goods_item.skuArr.length;
                console.log($scope.skuArrItems)
                $scope.goodsCollection=[];//清空数据
                SalesService.getGoodsByCompanyGoodsStatue().then(function (data) {
                    console.log(data);

                    $scope.goodsCollection=data.result;
                    $scope.company_sku_select=$scope.skuArrItems;
                    console.log($scope.skuArrItems);
                   for(var i in $scope.skuArrItems){
                       $scope.company_sku_select[i].sku_id=$scope.skuArrItems[i].company_goods_sku_id;
                       $scope.company_sku_select[i].goods_id=$scope.goods[index].company_goods_id;
                       $scope.company_sku_select[i].gift_number=1;
                       $scope.company_sku_select[i].limit_buy_number=0;
                       $scope.company_sku_select[i].limit_buy="否";
                       $scope.company_sku_select[i].activity_type=0;
                   }
                    console.log($scope.company_sku_select);
                }, function (err) {
                    console.log(err);
                });
                if( $scope.flag==true){
                    $('#giftModal').modal();
                }
                $scope.flag=true;

            }
            $scope.onDialogSelectPage =function(page){
                $scope.dialogCurrentPage=page;
                console.log( $scope.promotion_type_save)
                if($scope.promotion_type_save=='直降促销'){
                    $scope.flag=false;
                    $scope.specialPrice(item_id,page);
                }
                if($scope.promotion_type_save=='打折促销'){
                    $scope.flag=false;
                    $scope.discount(item_id,page);
                }
                if($scope.promotion_type_save='买一送一'){
                    $scope.flag=false;
                    $scope.gift(item_id,page);
                }

                /* if(parseInt(page)*4<$scope.goods_item.skuArr.length){
                 for (var i = 0; i < 4; i++) {
                 $scope.skuArrItems[i]=$scope.goods_item.skuArr[(parseInt(page)-1)*4+i];
                 }
                 }
                 else{
                 $scope.skuArrItems=[];
                 for (var i = 0; i < ($scope.goods_item.skuArr.length-(parseInt(page)-1)*4); i++) {
                 $scope.skuArrItems[i]=$scope.goods_item.skuArr[(parseInt(page)-1)*4+i];
                 }
                 }
                 $scope.company_sku_select=$scope.skuArrItems;
                 $scope.dialogPageStart =($scope.dialogCurrentPage - 1) * 4 + 1 ;
                 $scope.dialogPageEnd = parseInt(page)*4<$scope.goods_item.skuArr.length? parseInt(page)*4 :$scope.goods_item.skuArr.length;
                 console.log($scope.skuArrItems)*/
            }
            $scope.specialPrice =function(index,page){
                $scope.input_data=[];
                $scope.activity_type='';
                item_id=index;
                console.log($scope.goods[item_id]);
                $scope.goods_item=$scope.goods[index];
                if($scope.goods_item.company_goods_activity_icon){
                    $scope.covers= IconIp+$scope.goods_item.company_goods_activity_icon;
                    console.log($scope.covers);
                }
                $scope.dialogPageCount=($scope.goods_item.skuArr.length-1)/3+1;

                console.log($scope.dialogPages)

                $scope.goods[item_id].skuArr.forEach(function(item){
                    if(item!=null){
                            SalesService.updateSalePrice(item).then(function (data) {
                                console.log(data);
                            }, function (err) {
                                console.log(err);
                            })
                        }

                })
                if(parseInt(page)*3<$scope.goods_item.skuArr.length){
                    for (var i = 0; i < 3; i++) {
                        $scope.skuArrItems[i]=$scope.goods_item.skuArr[(parseInt(page)-1)*3+i];
                    }
                }
                else{
                    $scope.skuArrItems=[];
                    for (var i = 0; i < ($scope.goods_item.skuArr.length-(parseInt(page)-1)*3); i++) {
                        $scope.skuArrItems[i]=$scope.goods_item.skuArr[(parseInt(page)-1)*3+i];
                    }
                }
                $scope.dialogPageStart =($scope.dialogCurrentPage - 1) * 3 + 1 ;
                $scope.dialogPageEnd = parseInt(page)*3<$scope.goods_item.skuArr.length? parseInt(page)*3 :$scope.goods_item.skuArr.length;
                console.log($scope.skuArrItems)
                $scope.skuArrItems.forEach(function (item) {
                    $scope.input_data.push(item)
                })
                $scope.input_data.forEach(function(item){
                    item.limit_buy_number=0;
                    item.company_goods_sku_type=2;
                    item.limit_buy="否";
                    item.activity_type=0;
                });

                if( $scope.flag==true){
                    $('#specialPriceModal').modal();
                }
                $scope.flag=true;
                console.log($scope.goods[index].skuArr);

            }
            $scope.discount=function(index,page){
                $scope.input_data=[];
                item_id=index;
                $scope.activity_type=''
                $scope.goods_item=$scope.goods[index];
                if($scope.goods_item.company_goods_activity_icon){
                    $scope.covers= IconIp+$scope.goods_item.company_goods_activity_icon;
                    console.log($scope.covers);
                }
                $scope.dialogPageCount=($scope.goods_item.skuArr.length-1)/3+1;

                /* for (var i = 1; i <= $scope.dialogPageCount; i++) {
                 $scope.dialogPages.push(i);
                 }*/
                console.log($scope.dialogPages)

                console.log($scope.goods[item_id]);
                $scope.goods_item.skuArr.forEach(function (item) {
                    if(item!=null){
                        SalesService.updateSalePrice(item).then(function (data) {
                            console.log(data);

                        }, function (err) {
                            console.log(err);
                        })
                    }

                })
                if(parseInt(page)*3<$scope.goods_item.skuArr.length){
                    for (var i = 0; i < 3; i++) {
                        $scope.skuArrItems[i]=$scope.goods_item.skuArr[(parseInt(page)-1)*3+i];
                    }
                }
                else{
                    $scope.skuArrItems=[];
                    for (var i = 0; i < ($scope.goods_item.skuArr.length-(parseInt(page)-1)*3); i++) {
                        $scope.skuArrItems[i]=$scope.goods_item.skuArr[(parseInt(page)-1)*3+i];
                    }
                }
                $scope.dialogPageStart =($scope.dialogCurrentPage - 1) * 3 + 1 ;
                $scope.dialogPageEnd = parseInt(page)*3<$scope.goods_item.skuArr.length? parseInt(page)*3 :$scope.goods_item.skuArr.length;
                console.log($scope.skuArrItems)
                $scope.skuArrItems.forEach(function (item) {
                    $scope.input_data.push(item);
                })
                $scope.input_data.forEach(function(item){
                    item.company_goods_sku_type=1;
                    item.limit_buy_number=0;
                    item.discountRate=1;
                    item.limit_buy="否";
                    item.activity_type=0;
                });
                console.log($scope.goods[index].skuArr);
                var DataJson={
                    company_goods_id:$scope.goods[item_id].company_goods_id,
                }

           /*    SalesService.getCompanyGoodsDetail(DataJson).then(function (data) {
                   console.log(data);
                   $scope.skuCollection=data.sku;

                 /!*  $scope.skuCollection.forEach(function(item){
                       item.company_goods_sale_price=item.company_goods_price
                   });*!/
                   $scope.input_data=$scope.skuCollection;
                   $scope.input_data.forEach(function(item){
                       item.company_goods_sku_type=1;
                   });
                   console.log($scope.input_data);
                 /!*  $scope.input_data.forEach(function(item){
                       item.promotion_type=1;
                   });*!/
                   console.log($scope.goodsCollection);
                   console.log($scope.company_goods_selected);
               }, function (err) {
                   console.log(err);
               });*/
                if( $scope.flag==true){
                    $('#discountModal').modal();
                }
                $scope.flag=true;

            }
            $scope.getCompanySku=function(index,company_goods_id){
                console.log(company_goods_id);
               SalesService.getGoodsByCompanyGoodsSkuStatue(company_goods_id.company_goods_id).then(function (data) {
                   console.log(data);
                   $scope.skuCollection=data.result;

                   $scope.skuCollectionArray[index]=$scope.skuCollection;
                    console.log($scope.company_sku_select);
               }, function (err) {
                   console.log(err);
               });

            }
            $scope.getCompanySkuItem=function(company_goods_id){
                console.log(company_goods_id);
                SalesService.getGoodsByCompanyGoodsSkuStatue(company_goods_id).then(function (data) {
                    console.log(data);
                    $scope.skuCollection=data.result;
                }, function (err) {
                    console.log(err);
                });

            }
            var promotionArr=[];
            var promotionValidation =function(){
                var price_legal;
                var discount_legal;
                console.log($scope.input_data);
                $scope.input_data.forEach(function (item) {
                    var price_item_legal=validation.checkSalePrice(item.company_goods_sale_price,parseInt(item.company_goods_price));
                    var diacount_item_legal=validation.checkDiscount(item.discountRate);
                    if(price_item_legal){
                        price_legal=price_item_legal;
                    }
                    if(diacount_item_legal){
                        discount_legal=diacount_item_legal;
                    }
                })
                if($scope.input_data[0].company_goods_sku_type==2){
                    promotionArr=[price_legal];
                }
                if($scope.input_data[0].company_goods_sku_type==1){
                    promotionArr=[discount_legal];
                }
                var res=false;
                for(var i=0;i<promotionArr.length;i++){
                    var item=promotionArr[i];
                    if(item){
                        res=item;
                        break;
                    }
                }
                return res;
            }
            $scope.updateSkuAndGoods=function(){
                console.log('sssssssddw')
                if($scope.covers==null&&$scope.activity_icon_flag==true){
                    alert('添加活动图片')
                }
                else {
                    var res = promotionValidation();
                    if (res) {
                        alert(errMap[res])
                    } else {
                        var DataJson={};
                        console.log($scope.input_data)
                        var i=0;
                        $scope.input_data.forEach(function(item){
                            if(item.company_goods_sku_type==2){//特惠
                                if(item.company_goods_price<item.company_goods_sale_price){
                                    i++;
                                    if(item.limit_buy=='是'){
                                            DataJson={
                                                company_goods_sku_id:item.company_goods_sku_id,
                                                company_goods_price:item.company_goods_price,
                                                company_goods_sale_price:item.company_goods_sale_price,
                                                activity_type:item.activity_type,
                                                limit_buy_number:item.limit_buy_number,
                                                company_goods_sku_type:2,
                                                limit_buy:1
                                            }
                                            SalesService.updateSkuAndGoods(DataJson).then(function (data) {
                                                load($scope.params);
                                                $scope.activity_icon_flag=false;
                                                $('#specialPriceModal').modal('hide')

                                            }, function (err) {
                                                console.log(err);
                                            });
                                    }
                                    else{
                                            DataJson={
                                                company_goods_sku_id:item.company_goods_sku_id,
                                                company_goods_price:item.company_goods_price,
                                                company_goods_sale_price:item.company_goods_sale_price,
                                                activity_type:item.activity_type,
                                                company_goods_sku_type:2,
                                                limit_buy:0,
                                                limit_buy_number:0
                                            }
                                            SalesService.updateSkuAndGoods(DataJson).then(function (data) {
                                                load($scope.params);
                                                $scope.activity_icon_flag=false;
                                                $('#specialPriceModal').modal('hide')

                                            }, function (err) {
                                                console.log(err);
                                            });
                                    }
                                }

                            }
                            if(item.company_goods_sku_type==1) {
                                if( item.discountRate<1){
                                    i++;
                                    console.log('dsdsadsdw')
                                    if (item.limit_buy == '是') {
                                            DataJson = {
                                                company_goods_sku_id: item.company_goods_sku_id,
                                                discount_rate: item.discountRate,
                                                company_goods_sale_price: item.company_goods_sale_price,
                                                activity_type: item.activity_type,
                                                limit_buy_number: item.limit_buy_number,
                                                company_goods_sku_type: 1,
                                                limit_buy: 1
                                            }
                                            SalesService.updateSkuAndGoods(DataJson).then(function (data) {
                                                load($scope.params);
                                                $scope.activity_icon_flag = false;
                                                $('#discountModal').modal('hide')

                                            }, function (err) {
                                                console.log(err);
                                            });


                                    }
                                    else {
                                            DataJson = {
                                                company_goods_sku_id: item.company_goods_sku_id,
                                                discount_rate: item.discountRate,
                                                company_goods_sale_price: item.company_goods_sale_price,
                                                activity_type: item.activity_type,
                                                company_goods_sku_type: 1,
                                                limit_buy: 0,
                                                limit_buy_number:0
                                            }
                                            SalesService.updateSkuAndGoods(DataJson).then(function (data) {
                                                load($scope.params);
                                                $scope.activity_icon_flag = false;
                                                $('#discountModal').modal('hide')

                                            }, function (err) {
                                                console.log(err);
                                            });
                                    }
                                }


                            }
                        });
                        var arr=[$scope.covers];
                        if($scope.activity_icon_flag==true){
                            if($scope.covers){
                                var iconResize= SalesService.resize(arr,null,null,1,null);
                                iconResize.then(function(data){
                                    $scope.goods_item.company_goods_activity_icon=arr[0];
                                    var delImg=SalesService.delImg(waitDelImg.icon,waitDelImg.img);
                                    delImg.then(function(res){
                                        console.log('dsad')
                                        console.log(res);
                                    },function(err){
                                        console.log(err);
                                    },function(update){
                                        console.log(update);
                                    });
                                    console.log(waitDelImg);

                                    if(waitDelImg.icon.length!=0||(Object.prototype.toString.call($scope.goods_item.company_goods_activity_icon) != "[object String]")){
                                        console.log('ewf')
                                        addSave();
                                    }else {
                                        console.log($scope.goods_item.company_goods_activity_icon);
                                        console.log('dewdw')
                                        if($scope.goods_item.company_goods_activity_icon)$scope.goods_item.company_goods_activity_icon=$scope.goods_item.company_goods_activity_icon.substring(IconIp.length,$scope.goods_item.company_goods_activity_icon.length);
                                    }
                                    console.log($scope.goods_item);
                                },function(err){
                                    console.log(err);
                                })
                            }
                        }

                    }

                }
            }
            $scope.editor=function(sku){

                if(sku.company_goods_sku_audit==2){
                    $scope.activity_temp=[];
                    for(var i=1;i<$scope.activity_type_all.length;i++){
                        $scope.activity_temp[i-1]=$scope.activity_type_all[i];
                    }
                    console.log( $scope.activity_temp);
                }
                $scope.sku_item=sku;
                $scope.sku_item.discount_rate=$scope.sku_item.discount_rate/1000;
                $scope.sku_item.discount_save_rate=$scope.sku_item.discount_save_rate/1000;
                if(sku.company_goods_sku_buy_number==0){
                    $scope.sku_item.limit_buy='否'
                }
                else{
                    $scope.sku_item.limit_buy='是'
                }
                if(!sku.company_goods_sku_activity_id){
                    $scope.sku_item.company_goods_sku_activity_id=0
                }
                if($scope.sku_item.company_goods_sku_type==3){
                    SalesService.getGoodsByCompanyGoodsStatue().then(function (data) {
                        console.log(data);
                        $scope.goodsCollection=data.result;
                        $scope.getCompanySkuItem($scope.sku_item.giftSkuArray[0].company_goods_id);
                    }, function (err) {
                        console.log(err);
                    });
                }
                console.log($scope.goodsCollection)
                console.log($scope.sku_item);
                console.log('hehe');
                $('#editorModal').modal();

            }
            $scope.pause=function(index){
                item_id=index;
                $('#pauseModal').modal();
            }
            $scope.pausePromotion=function(index){
                item_id=index;
                $('#pausePromotionModal').modal();
            }
            $scope.pausePromotionActivity =function(){
                $scope.goods[item_id].skuArr.forEach(function(item){
                    var chgDataJson={
                        audit:$scope.goods[item_id].company_goods_audit,
                        company_goods_id:$scope.goods[item_id].company_goods_id,
                        company_goods_sku_id:item.company_goods_sku_id,
                        selfActivity:2
                    }
                    console.log(chgDataJson);
                    SalesService.chgCompanyGoodsStatue(chgDataJson).then(function(data){
                        $('#pausePromotionModal').modal('hide');
                        load($scope.params);
                    },function(err){
                        alert(err);
                    })
                })

            }

        $scope.chg=function(){
            console.log($scope.sku_item.company_goods_sku_buy_number)
            var company_goods_sku_buy_number_legal=validation.checkNumber($scope.sku_item.company_goods_sku_buy_number,'LIMIT_NUMBER_ERROR');
            console.log(company_goods_sku_buy_number_legal)
            console.log($scope.sku_item);
            if($scope.sku_item.company_goods_sku_type==2){//特惠
                if($scope.sku_item.company_goods_sku_audit==1){
                    var price_legal=validation.checkSalePrice($scope.sku_item.company_goods_sale_price,parseInt($scope.sku_item.company_goods_price));
                }
                   else{
                    var price_legal=validation.checkSalePrice($scope.sku_item.company_goods_sale_price,parseInt($scope.sku_item.company_goods_sku_save_price));
                }
                if(price_legal){
                    alert(errMap[price_legal])
                }else{
                    if($scope.sku_item.limit_buy=='是') {
                        if(company_goods_sku_buy_number_legal){
                            alert(errMap[company_goods_sku_buy_number_legal])
                        }else{
                            if($scope.sku_item.company_goods_sku_audit==1){
                                var DataJson={
                                    company_goods_sku_id:$scope.sku_item.company_goods_sku_id,
                                    company_goods_price:$scope.sku_item.company_goods_price,
                                    company_goods_sale_price:$scope.sku_item.company_goods_sale_price,
                                    activity_type:$scope.sku_item.company_goods_sku_activity_id,
                                    limit_buy_number:$scope.sku_item.company_goods_sku_buy_number,
                                    company_goods_sku_type:2,
                                    limit_buy:1,
                                    company_goods_sku_audit:1
                                }
                            }
                            if($scope.sku_item.company_goods_sku_audit==2){
                                var DataJson={
                                    company_goods_sku_id:$scope.sku_item.company_goods_sku_id,
                                    company_goods_price:$scope.sku_item.company_goods_sku_save_price,
                                    company_goods_sale_price:$scope.sku_item.company_goods_sale_price,
                                    activity_type:$scope.sku_item.company_goods_sku_activity_id,
                                    limit_buy_number:$scope.sku_item.company_goods_sku_buy_number,
                                    company_goods_sku_type:2,
                                    limit_buy:1,
                                    company_goods_sku_audit:2
                                }
                            }
                            SalesService.updateSkuAndGoods(DataJson).then(function (data) {
                                load($scope.params);
                                $('#editorModal').modal('hide')
                            }, function (err) {
                                console.log(err);
                            });
                        }
                    }
                    else{
                            if($scope.sku_item.company_goods_sku_audit==1){
                                var DataJson={
                                    company_goods_sku_id:$scope.sku_item.company_goods_sku_id,
                                    company_goods_price:$scope.sku_item.company_goods_price,
                                    company_goods_sale_price:$scope.sku_item.company_goods_sale_price,
                                    activity_type:$scope.sku_item.company_goods_sku_activity_id,
                                    company_goods_sku_type:2,
                                    limit_buy:0,
                                    company_goods_sku_audit:1,
                                    limit_buy_number:0,
                                }
                            }
                            if($scope.sku_item.company_goods_sku_audit==2){
                                var DataJson={
                                    company_goods_sku_id:$scope.sku_item.company_goods_sku_id,
                                    company_goods_price:$scope.sku_item.company_goods_sku_save_price,
                                    company_goods_sale_price:$scope.sku_item.company_goods_sale_price,
                                    activity_type:$scope.sku_item.company_goods_sku_activity_id,
                                    company_goods_sku_type:2,
                                    limit_buy:0,
                                    company_goods_sku_audit:2,
                                    limit_buy_number:0,
                                }
                            }
                            SalesService.updateSkuAndGoods(DataJson).then(function (data) {
                                load($scope.params);
                                $('#editorModal').modal('hide')
                            }, function (err) {
                                console.log(err);
                            });
                    }
                }

            }
            if($scope.sku_item.company_goods_sku_type==1){
                if($scope.sku_item.company_goods_sku_audit==1){
                    var discount_legal=validation.checkDiscount($scope.sku_item.discount_rate);
                }
                else{
                    var discount_legal=validation.checkDiscount($scope.sku_item.discount_save_rate);
                }
                if(discount_legal){
                    alert(errMap[discount_legal])
                }else{
                    if($scope.sku_item.limit_buy=='是'){
                        if(company_goods_sku_buy_number_legal){
                            alert(errMap[company_goods_sku_buy_number_legal])
                        }else{
                            if($scope.sku_item.company_goods_sku_audit==1){
                                var DataJson={
                                    company_goods_sku_id:$scope.sku_item.company_goods_sku_id,
                                    discount_rate:$scope.sku_item.discount_rate,
                                    company_goods_sale_price:$scope.sku_item.company_goods_sale_price,
                                    activity_type:$scope.sku_item.company_goods_sku_activity_id,
                                    limit_buy_number:$scope.sku_item.company_goods_sku_buy_number,
                                    company_goods_sku_type:1,
                                    limit_buy:1,
                                    company_goods_sku_audit:1
                                }
                            }
                            if($scope.sku_item.company_goods_sku_audit==2){
                                var DataJson={
                                    company_goods_sku_id:$scope.sku_item.company_goods_sku_id,
                                    discount_rate:$scope.sku_item.discount_save_rate,
                                    company_goods_sale_price:$scope.sku_item.company_goods_sale_price,
                                    activity_type:$scope.sku_item.company_goods_sku_activity_id,
                                    limit_buy_number:$scope.sku_item.company_goods_sku_buy_number,
                                    company_goods_sku_type:1,
                                    limit_buy:1,
                                    company_goods_sku_audit:2
                                }
                            }
                            SalesService.updateSkuAndGoods(DataJson).then(function (data) {
                                load($scope.params);
                                $('#editorModal').modal('hide');
                            }, function (err) {
                                console.log(err);
                            });
                        }

                    }
                    else{
                            if($scope.sku_item.company_goods_sku_audit==1){
                                var  DataJson={
                                    company_goods_sku_id:$scope.sku_item.company_goods_sku_id,
                                    discount_rate:$scope.sku_item.discount_rate,
                                    company_goods_sale_price:$scope.sku_item.company_goods_sale_price,
                                    activity_type:$scope.sku_item.company_goods_sku_activity_id,
                                    company_goods_sku_type:1,
                                    limit_buy:0,
                                    company_goods_sku_audit:1,
                                    limit_buy_number:0,
                                }
                            }
                            if($scope.sku_item.company_goods_sku_audit==2){
                                var  DataJson={
                                    company_goods_sku_id:$scope.sku_item.company_goods_sku_id,
                                    discount_rate:$scope.sku_item.discount_save_rate,
                                    company_goods_sale_price:$scope.sku_item.company_goods_sale_price,
                                    activity_type:$scope.sku_item.company_goods_sku_activity_id,
                                    company_goods_sku_type:1,
                                    limit_buy:0,
                                    company_goods_sku_audit:2,
                                    limit_buy_number:0,
                                }
                            }
                            SalesService.updateSkuAndGoods(DataJson).then(function (data) {
                                load($scope.params);
                                $('#editorModal').modal('hide');
                            }, function (err) {
                                console.log(err);
                            });

                    }
                }

            }
            if($scope.sku_item.company_goods_sku_type==3) {
                console.log($scope.sku_item);
                if($scope.sku_item.company_goods_sku_audit==1){
                    var gift_sku_number_legal=validation.checkNumber($scope.sku_item.gift_sku_number,'GIFT_ERROR');
                }else{
                    var gift_sku_number_legal=validation.checkNumber($scope.sku_item.gift_sku_save_number,'GIFT_ERROR');
                }

                    if ($scope.sku_item.limit_buy == '是') {
                        if(gift_sku_number_legal){
                            alert(errMap[gift_sku_number_legal]);
                        }else if(company_goods_sku_buy_number_legal){
                            alert(errMap[company_goods_sku_buy_number_legal]);
                        }else{
                            if($scope.sku_item.company_goods_sku_audit==1){
                                var chgDataJson = {
                                    company_goods_id: $scope.sku_item.company_goods_id,
                                    //gift_company_goods_id:$scope.company_goods_selected.company_goods_id,
                                    company_goods_sku_id: $scope.sku_item.company_goods_sku_id,
                                    gift_sku_id:$scope.sku_item.gift_sku_id,
                                    gift_number: $scope.sku_item.gift_sku_number,
                                    activity_type: $scope.sku_item.company_goods_sku_activity_id,
                                    limit_buy_number: $scope.sku_item.company_goods_sku_buy_number,
                                    company_goods_sku_type: 3,//买一送一
                                    limit_buy: 1,
                                    company_goods_sku_audit:1
                                }
                                console.log(chgDataJson)
                            }
                            if($scope.sku_item.company_goods_sku_audit==2){
                                var chgDataJson = {
                                    company_goods_id: $scope.sku_item.company_goods_id,
                                    //gift_company_goods_id:$scope.company_goods_selected.company_goods_id,
                                    company_goods_sku_id: $scope.sku_item.company_goods_sku_id,
                                    gift_sku_id:$scope.sku_item.gift_sku_save_id,
                                    gift_number: $scope.sku_item.gift_sku_save_number,
                                    activity_type: $scope.sku_item.company_goods_sku_activity_id,
                                    limit_buy_number: $scope.sku_item.company_goods_sku_buy_number,
                                    company_goods_sku_type: 3,//买一送一
                                    limit_buy: 1,
                                    company_goods_sku_audit:2
                                }
                            }
                            console.log(chgDataJson)
                            SalesService.chgCompanyGoodsStatue(chgDataJson).then(function (data) {
                                load($scope.params);
                                $('#editorModal').modal('hide');
                            }, function (err) {
                                alert(err);
                            })
                        }


                    }
                    else {
                        if(gift_sku_number_legal){
                            alert(errMap[gift_sku_number_legal]);
                        }else{
                                if($scope.sku_item.company_goods_sku_audit==1){
                                    var chgDataJson = {
                                        company_goods_id: $scope.sku_item.company_goods_id,
                                        //gift_company_goods_id:$scope.company_goods_selected.company_goods_id,
                                        company_goods_sku_id: $scope.sku_item.company_goods_sku_id,
                                        gift_sku_id: $scope.sku_item.gift_sku_id,
                                        gift_number:  $scope.sku_item.gift_sku_number,
                                        activity_type: $scope.sku_item.company_goods_sku_activity_id,
                                        company_goods_sku_type: 3,
                                        limit_buy: 0,
                                        company_goods_sku_audit:1,
                                        limit_buy_number:0,
                                    }
                                }
                                if($scope.sku_item.company_goods_sku_audit==2){
                                    var chgDataJson = {
                                        company_goods_id: $scope.sku_item.company_goods_id,
                                        //gift_company_goods_id:$scope.company_goods_selected.company_goods_id,
                                        company_goods_sku_id: $scope.sku_item.company_goods_sku_id,
                                        gift_sku_id: $scope.sku_item.gift_sku_save_id,
                                        gift_number:  $scope.sku_item.gift_sku_save_number,
                                        activity_type: $scope.sku_item.company_goods_sku_activity_id,
                                        company_goods_sku_type: 3,
                                        limit_buy: 0,
                                        company_goods_sku_audit:2,
                                        limit_buy_number:0,
                                    }
                                }
                                SalesService.chgCompanyGoodsStatue(chgDataJson).then(function (data) {
                                    load($scope.params);
                                    $('#editorModal').modal('hide');
                                }, function (err) {
                                    alert(err);
                                })
                        }
                    }
            }
        }
            $scope.selectStatue=function(item){
                $scope.conditionParams.company_goods_status_id=item.company_goods_status_id;
                $scope.conditionParams.sales_promotion=item.sales_promotion;
                $scope.conditionParams.type=item.type;
                $scope.conditionParams.audit=item.audit;
                $scope.orderStatue.forEach(function(data){
                    data.select=false;
                })
                item.select=true;
                $scope.currentPage = 1;
                $scope.params = $.extend($scope.params,$scope.conditionParams);
                console.log($scope.params);
                load($scope.params);
            }
            $scope.pauseActivity=function(){
                console.log('odoso')
                var chgDataJson={};
                console.log( $scope.goods[item_id])
                if($scope.goods[item_id].company_goods_self_activity==1){
                    $scope.goods[item_id].skuArr.forEach(function(item){
                        chgDataJson={
                            audit:$scope.goods[item_id].company_goods_audit,
                            company_goods_id:$scope.goods[item_id].company_goods_id,
                            company_goods_sku_id:item.company_goods_sku_id,
                            selfActivity:1
                        }
                        console.log(chgDataJson);
                        SalesService.chgCompanyGoodsStatue(chgDataJson).then(function(data){
                            load($scope.params);
                        },function(err){
                            alert(err);
                        })
                    })
                }
             /*   if($scope.goods[item_id].company_goods_audit==2)
                {
                    console.log('jjde')
                    $scope.goods[item_id].skuArr.forEach(function(item){
                        chgDataJson={
                            audit:$scope.goods[item_id].company_goods_audit,
                            company_goods_id:$scope.goods[item_id].company_goods_id,
                            company_goods_sku_id:item.company_goods_sku_id,
                            selfActivity:2
                        }
                        console.log(chgDataJson);
                        SalesService.chgCompanyGoodsStatue(chgDataJson).then(function(data){

                        },function(err){
                            alert(err);
                        })
                    })
                }*/
                $('#pauseModal').modal('hide');
                $scope.activity_icon_flag=false;
            }

            $scope.update=function(){
                console.log($scope.company_sku_select);
                if($scope.covers==null&&$scope.activity_icon_flag==true){
                    alert('添加活动图片')
                }
                else{
                    console.log('sdsdsdsdsd')
                    var chgDataJson={};
                    console.log( $scope.company_sku_select);
                    $scope.company_sku_select.forEach(function(item){
                        if(item.gift_sku!=undefined && item.gift_sku!=null){
                            if(item.limit_buy=='是')
                            {
                                if(item.limit_buy_number!=null&&item.gift_number!=null&&item.activity_type!=null){//判断是否为空
                                    chgDataJson={
                                        company_goods_id:item.goods_id,
                                        //gift_company_goods_id:$scope.company_goods_selected.company_goods_id,
                                        company_goods_sku_id:item.sku_id,
                                        gift_sku_id:item.gift_sku.company_goods_sku_id,
                                        gift_number:item.gift_number,
                                        activity_type:item.activity_type,
                                        limit_buy_number:item.limit_buy_number,
                                        company_goods_sku_type:3,//买一送一
                                        limit_buy:1
                                    }
                                    SalesService.chgCompanyGoodsStatue(chgDataJson).then(function(data){
                                        $('#giftModal').modal('hide');
                                        $scope.activity_icon_flag=false;
                                        load($scope.params);
                                        console.log($scope.company_sku_select);
                                    },function(err){
                                        alert(err);
                                    })
                                }
                            }
                            else{
                                if(item.gift_number!=null&&item.activity_type!=null){
                                    chgDataJson={
                                        company_goods_id:item.goods_id,
                                        //gift_company_goods_id:$scope.company_goods_selected.company_goods_id,
                                        company_goods_sku_id:item.sku_id,
                                        gift_sku_id:item.gift_sku.company_goods_sku_id,
                                        gift_number:1,
                                        activity_type:item.activity_type,
                                        company_goods_sku_type:3,
                                        limit_buy:0,
                                        limit_buy_number:0,
                                    }
                                    SalesService.chgCompanyGoodsStatue(chgDataJson).then(function(data){
                                        $('#giftModal').modal('hide');
                                        $scope.activity_icon_flag=false;
                                        load($scope.params);
                                        console.log($scope.company_sku_select);
                                    },function(err){
                                        alert(err);
                                    })
                                }

                            }
                            console.log(chgDataJson);

                        }

                    })

                    var arr=[$scope.covers];
                    if($scope.activity_icon_flag==true){
                        if($scope.covers){
                            var iconResize= SalesService.resize(arr,null,null,0.5,null);
                            iconResize.then(function(data){
                                $scope.goods_item.company_goods_activity_icon=arr[0];
                                var delImg=SalesService.delImg(waitDelImg.icon,waitDelImg.img);
                                delImg.then(function(res){
                                    console.log('dsad')
                                    console.log(res);
                                },function(err){
                                    console.log(err);
                                },function(update){
                                    console.log(update);
                                });
                                console.log(waitDelImg);

                                if(waitDelImg.icon.length!=0||(Object.prototype.toString.call($scope.goods_item.company_goods_activity_icon) != "[object String]")){
                                    console.log('ewf')
                                    addSave();
                                }else {
                                    console.log($scope.goods_item.company_goods_activity_icon);
                                    console.log('dewdw')
                                    if($scope.goods_item.company_goods_activity_icon)$scope.goods_item.company_goods_activity_icon=$scope.goods_item.company_goods_activity_icon.substring(IconIp.length,$scope.goods_item.company_goods_activity_icon.length);
                                }

                                console.log($scope.goods_item);
                            },function(err){
                                console.log(err);
                            })
                        }
                    }

                }

            }

            function addSave (){
                console.log('保存图片');
                console.log($scope.files);
                $scope.files.splice($scope.files.length-1,1);
                var uploadIconPromise=SalesService.uploadImg(iconUploadIP,$scope.goods_item.company_goods_activity_icon);
                uploadIconPromise.then(function(res){
                    $scope.goods_item.company_goods_activity_icon=res.data.path;
                    console.log($scope.goods_item.company_goods_activity_icon);
                    var addGood=SalesService.updateGoodsActivityIcon($scope.goods_item);
                    addGood.then(function(data){
                        console.log(data);
                    },function(err){
                        console.log(err);
                    })
                },function(err){
                    console.log(err);
                },function(update){
                    console.log(update);
                });
            }

            $scope.upload=function($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event){
                console.log($files);
                console.log(waitDelImg);
                if($file){
                    $scope.covers=$file;
                    console.log($scope.goods_item.company_goods_activity_icon);
                    console.log(Object.prototype.toString.call($scope.goods_item.company_goods_activity_icon));
                    if(Object.prototype.toString.call($scope.goods_item.company_goods_activity_icon) == "[object String]"){
                        waitDelImg.icon[0]=$scope.goods_item.company_goods_activity_icon;
                    }
                }
            }
            $scope.chActivity= function(index,activity_type){
            if(activity_type!=0){
                $scope.skuArrItems[index].activity_icon_flag=true;
            }
            else{
                $scope.skuArrItems[index].activity_icon_flag=false;
            }
                $scope.activity_icon_flag=false;
                $scope.skuArrItems.forEach(function(item){
                    $scope.activity_icon_flag=$scope.activity_icon_flag||item.activity_icon_flag
                })
            }
            $scope.cancel = function(){
                load($scope.params);
                $scope.activity_icon_flag=false;
            }
        })
    });
