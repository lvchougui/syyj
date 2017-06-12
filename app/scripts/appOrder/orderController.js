/**
 * Created by zhaohui on 15-5-8.
 */
define(['common/controllers', 'appOrder/orderServices', 'moment', 'domReady', 'config'],
    function (controllers,OrderServices, moment, domReady, SiteConfig) {
        controllers.controller('OrderCtrl',function ($scope,OrderServices,$state,validation,errMap,fileUpload) {
            // 初始化时间控件
            $scope.orderStatue=[{company_orders_status_id:'0',company_goods_status_name:'全部',select:true},
                {company_orders_status_id:'1',company_goods_status_name:'待发货',select:false},
                {company_orders_status_id:'2',company_goods_status_name:'送货中',select:false},
                {company_orders_status_id:'3',company_goods_status_name:'已收货',select:false}];
            $scope.orderType=[{order_type_name:"直购订单",order_type_value:1,select:true},
                {order_type_name:"拼团订单",order_type_value:2,select:false}];
            $('#dpStart, #dpEnd').datepicker({});
            //快递公司编号对应表
            $scope.expressCode=[
                {
                    "com":"顺丰",
                    "kdnno":"SF",
                    "jhno":"sf",
                    "yz":"7"
                },
                {
                    "com":"申通",
                    "kdnno":"STO",
                    "jhno":"sto",
                    "yz":"1"
                },
                {
                    "com":"圆通",
                    "kdnno":"YTO",
                    "jhno":"yt",
                    "yz":"2"
                },
                {
                    "com":"韵达",
                    "kdnno":"YD",
                    "jhno":"yd",
                    "yz":"4"
                },
                {
                    "com":"天天",
                    "kdnno":"HHTT",
                    "jhno":"tt",
                    "yz":"5"
                },
                {
                    "com":"EMS",
                    "kdnno":"EMS",
                    "jhno":"ems",
                    "yz":"11"
                },
                {
                    "com":"中通",
                    "kdnno":"ZTO",
                    "jhno":"zto",
                    "yz":"3"
                },
                {
                    "com":"汇通",
                    "kdnno":"HTKY",
                    "jhno":"ht",
                    "yz":"6"
                }
            ];

            // 筛选条件
        	$scope.conditionParams = {
        		dateStart:'',
        		dateEnd:'',
                company_orders_status_id:'',
                company_orders_type:1
        	}
        	$scope.orderNo = '';
        	$scope.params ={company_orders_status_id:0};
            $scope.point=[];
            $scope.count = 0;
            $scope.currentPage = 1;
            $scope.numPages = 1;
            $scope.pageSize = 10;
            $scope.pages = [];
            $scope.pageStart = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.pageEnd = $scope.pageSize;
            $scope.dialogCurrentPage=1;
            $scope.dialogPageSize=8
            $scope.dialogPageStart = ($scope.dialogCurrentPage - 1) * $scope.dialogPageSize;
            $scope.dialogPageEnd = 1;
            $scope.dialogPages=[];
            $scope.dialogPage=1;
            $scope.dialogPageCount=1

            var errStatueMap=errMap.getMap();
            var load =function(params){
            	params.page = $scope.currentPage;
            	params.size = $scope.pageSize;
                OrderServices.getOrders(params).then(function(data){
                        console.log(data);
                        $scope.count = data.counts;
                        $scope.orders = data.result;
                        $scope.numPages = data.counts>0?Math.ceil(data.counts / $scope.pageSize):1;
                        $scope.pageStart = data.counts>0?($scope.currentPage - 1) * $scope.pageSize + 1:0;
                        $scope.pageEnd = $scope.pageSize * $scope.currentPage > data.counts ? data.counts : $scope.currentPage * $scope.pageSize;
                },function(err){
                    alert(err);
                })
            }
            load($scope.params);

            OrderServices.getStatusOptions().then(function(data){
                    $scope.orderStatusOptions = data;
                    // 添加空选项
                    $scope.orderStatusOptions.unshift({
                        company_orders_status_id:0,
                        company_orders_status_name:'全选'
                    })
                    $scope.conditionParams.company_orders_status_id=$scope.orderStatusOptions[0].company_orders_status_id;

            },function(err){
                alert(err);
            })

            // 翻页
            $scope.onSelectPage = function (page) {
                $scope.currentPage = page;
                load($scope.params);
                $scope.allChecked = false;
            };
            $scope.lookUp=function(){
                $scope.currentPage = 1;
                load($scope.params);
                $scope.allChecked = false;
            }

            // 根据条件筛选
            $scope.loadByCondition = function(){
                $scope.currentPage = 1;
                $scope.conditionParams.dateStart = $("#dpStart").val();
                $scope.conditionParams.dateEnd = $("#dpEnd").val();
                console.log($scope.conditionParams);
            	$scope.params = $.extend($scope.params,$scope.conditionParams) ;
                $scope.params.order_no='';
                console.log($scope.params);
            	load($scope.params);
                $scope.allChecked = false;
            }
            $scope.exportExcel = function(){
                $scope.params.page = $scope.currentPage;
                $scope.params.size = $scope.pageSize;
                console.log($scope.params)
                var exportUrl = OrderServices.getExportExcelUrl($scope.params);
                // alert(exportUrl);
                window.open(exportUrl);
            }

            $scope.loadByOrderNo = function(){
            	$scope.params = {
                    order_no:$scope.order_no,
                    page:1,
                    size:10
            	}
                console.log($scope.params);
            	load($scope.params);
                $scope.allChecked = false;
            }

            $scope.deliver = function(index){
               var orderNo = $scope.orders[index].order_no;
                var fresh = $scope.orders[index].fresh;
                var companyOrdersId=$scope.orders[index].company_orders_id;
                $scope.modalConf={
                    inputName:'快递单号',
                    company_id:localStorage.company_id,
                    express_company_id:$scope.expressCode[0].yz,
                    express_no:0,
                    company_orders_id:companyOrdersId,
                    order_no:orderNo,
                    deliver_charges:0,
                    fresh:fresh
                }
                console.log($scope.orders[index].company_orders_id);
                if($scope.orders[index].fresh==1){
                    $('#expressNotifyModal').modal();
                }else{
                    $('#orderNotifyModal').modal();
                }
            }

            //index=0快递单
            $scope.send=function(index){
                console.log(index);
                console.log($scope.modalConf);

                if(index==0&&($scope.modalConf.express_no==0||!$scope.modalConf.express_no)){
                    alert('请输入快递单号');
                }else{

                    console.log("执行到我这了");

                    OrderServices.chgOrderStatue($scope.modalConf).then(function(data){
                        $('#expressNotifyModal').modal('hide');
                        $('#orderNotifyModal').modal('hide');
                        load($scope.params);
                    },function(err){
                        $('#expressNotifyModal').modal('hide');
                        $('#orderNotifyModal').modal('hide');
                        alert(err);
                    })
                }
            }

            $scope.selectStatue=function(item){

                $scope.conditionParams.company_orders_status_id=item.company_orders_status_id;
                $scope.orderStatue.forEach(function(data){
                    data.select=false;
                })
                item.select=true;
                $scope.currentPage = 1;
                $scope.params = $.extend($scope.params,$scope.conditionParams);
                load($scope.params);

            }

            $scope.selectType = function(item){
                //TODO
                console.log(item);
                $scope.conditionParams.company_orders_type = item.order_type_value;
                $scope.orderType.forEach(function(data){
                    data.select = false;
                });
                item.select = true;
                $scope.currentPage = 1;
                $scope.params = $.extend($scope.params,$scope.conditionParams);
                load($scope.params);
            }

            $scope.check = function(index,item){
                console.log($scope.orders[index])
                console.log(item);
            }
            $scope.chkAll = function(allChecked){
                console.log(allChecked)
                for(var index in $scope.orders){
                    var order = $scope.orders[index];
                    order.checked = allChecked;
                }
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
            $scope.onDialogSelectPage = function (page) {
                console.log('dsds')
                $scope.dialogCurrentPage=page;
                $scope.dialogPageStart =($scope.dialogCurrentPage - 1) * $scope.dialogPageSize ;
                $scope.dialogPageEnd = parseInt(page)*$scope.dialogPageSize<$scope.arr.length? parseInt(page)*$scope.dialogPageSize :$scope.arr.length;
                console.log($scope.dialogCurrentPage);
                $scope.pageArr=[];
                for(var i=$scope.dialogPageStart;i<$scope.dialogPageEnd;i++)
                {
                    $scope.pageArr.push( $scope.arr[i])
                }
                console.log($scope.pageArr)
            }

            $scope.download = function () {
               window.open(localExcelIp+'/excel/模板.zip');

            }
            $scope.readExcel=function ($files, $file) {
                $scope.arr=[];
                $scope.files=[];
                $scope.pageArr=[];
                $scope.files=$files;
                console.log( $scope.files)
                OrderServices.uploadFile($scope.files.pop()).then(function (data) {
                    console.log(data)
                    var result=data.data;
                    console.log(result)
                    for(var i=0;i<result.length;i=i+5){
                        console.log(i)
                        $scope.arr.push({company_orders_id:result[i],order_no:result[i+1],express_company_id:result[i+2],express_no:result[i+3],deliver_charges:result[i+4]})
                    }
                    console.log( $scope.arr);
                    $scope.arr.shift();
                    console.log( $scope.arr);
                    //页数
                    $scope.dialogPageCount=parseInt($scope.arr.length/$scope.dialogPageSize)+1;
                    console.log('页数');
                    console.log($scope.dialogPageCount);
                    if($scope.dialogPageCount==1){
                        for(var i=0;i<$scope.arr.length;i++)
                        {
                            $scope.pageArr.push($scope.arr[i])
                        }
                    }else{
                        for(var i=0;i<$scope.dialogPageSize;i++)
                        {
                            $scope.pageArr.push($scope.arr[i])
                        }
                    }

                   /* console.log('$scope.pageArr=');
                    console.log( $scope.pageArr);*/
                    $('#deliverNotifyModal').modal();
                    console.log($scope.arr);
                }, function (err) {
                    console.log(err)
                })
            }
            $scope.sendAll = function () {
                var i=0;
                console.log("批量发货");
                console.log( $scope.arr);
                console.log( $scope.arr.length);
                /*if(!$scope.arr.length||$scope.arr.length==0){
                    alert("模板中没有订单！");
                    return false;
                }*/
/*
                $scope.arr.forEach(function (item) {
                    console.log(item.company_orders_id);
                    item.company_id=localStorage.company_id;
                    item.fresh=1;
                    var order_id=item.company_orders_id.toString();
                    var order_no=item.order_no.toString();
                    var express_company_id=item.express_company_id.toString();
                    var deliver_charges=item.deliver_charges.toString();
                    if(!order_id||!order_id.match(/^[1-9][0-9]*$/)){
                        alert("您的订单ID不合法，请重新填写再上传");
                        return  location.reload();
                    }else if(!order_no||!order_no.match(/^[0-9][0-9]*$/)){
                        alert("您的订单号不合法，请重新填写再上传");
                        return  location.reload();
                    }else if(!express_company_id||!express_company_id.match(/^([1-7]||11)$/)){
                        alert("您的快递公司编号不合法，请重新填写再上传");
                        return  location.reload();
                    }else if(!deliver_charges||!deliver_charges.match(/^[1-9][0-9]*$/)){
                        alert("您的运费设置不合法，请重新填写再上传");
                        return  location.reload();
                    }

                    console.log(item);
                })
*/

                for(j=0;j<$scope.arr.length;j++){

                    $scope.arr[j].company_id=localStorage.company_id;
                    $scope.arr[j].fresh=1;
                    var order_id=$scope.arr[j].company_orders_id.toString();
                    var order_no=$scope.arr[j].order_no.toString();
                    var express_company_id=$scope.arr[j].express_company_id.toString();
                    var deliver_charges=$scope.arr[j].deliver_charges.toString();
                    if(!order_id||!order_id.match(/^[1-9][0-9]*$/)){
                        alert("您的订单ID不合法，请重新填写再上传");
                        return  location.reload();
                    }else if(!order_no||!order_no.match(/^[0-9][0-9]*$/)){
                        alert("您的订单号不合法，请重新填写再上传");
                        return  location.reload();
                    }else if(!express_company_id||!express_company_id.match(/^([1-7]||11)$/)){
                        alert("您的快递公司编号不合法，请重新填写再上传");
                        return  location.reload();
                    }else if(!deliver_charges||!deliver_charges.match(/(^[1-9][0-9]*(.[0-9]{1,2})?$)|(^[0](.[0-9]{1,2})?$)/)){
                        alert("您的运费设置不合法，请重新填写再上传");

                        return  location.reload();
                    }

                }


                $scope.arr.forEach(function (item) {
                        console.log(item);
                        OrderServices.chgOrderStatue(item).then(function(data){
                            i++;

                            if(i==$scope.arr.length){
                                $('#deliverNotifyModal').modal('hide');
                                location.reload();
                            }
                        },function(err){
                            $('#deliverNotifyModal').modal('hide');
                            alert(err);
                        })
                })
            }
            var orderList=[];
            $scope.deliverBatch=function(){
                    console.log($scope.orders);
                    orderList=[];
                $scope.orders.forEach(function(item){
                    console.log(item);
                    if(item.checked){
                            orderList.push(item);
                        }
                    })
                if(orderList.length==0){
                    return alert('请勾选发货单');
                }
                console.log(orderList);
                var goodsArray=[];
                orderList.forEach(function(item){
                    item.goods.forEach(function(item){
                        goodsArray.push(item);
                    })
                })
                console.log(goodsArray);

                var goodJson={};

                goodsArray.forEach(function(item){
                    if(!goodJson[item.company_goods_name]){
                        goodJson[item.company_goods_name]=[];
                    }
                    goodJson[item.company_goods_name].push({company_goods_norms:item.company_goods_norms,quantity:item.company_orders_goods_quantity});
                })

                for(var i in goodJson){
                    var json={};
                    goodJson[i].forEach(function(item){
                        if(json[item.company_goods_norms]) {
                            json[item.company_goods_norms]=json[item.company_goods_norms]+parseInt(item.quantity);
                        }else{
                            json[item.company_goods_norms]=parseInt(item.quantity);
                        }

                    })
                    goodJson[i]=json;

                }
                console.log(goodJson);
                var ordersArray=[];

                for(var i in goodJson){
                    for(var k in goodJson[i]){
                        ordersArray.push({company_goods_name:i,company_goods_norms:k,quantity:goodJson[i][k]})
                    }
                }
                $scope.goodsArray=ordersArray;
                $('#listNotifyModal').modal();
                console.log($scope.goodsArray);
            }
            $scope.deliverRemind=function(){
                $scope.RemindInformation={
                    phone:'',
                    toEmail:'',
                    isNeeded:true
                }
                OrderServices.selectRemindInformation().then(function (data) {
                    $scope.RemindInformation.phone=data[0].remind_phone;
                    $scope.RemindInformation.toEmail=data[0].remind_email
                    $scope.RemindInformation.isNeeded=(data[0].delivert_remind==0?false:true)
                    console.log($scope.RemindInformation)
                    console.log(data);
                },function(err){
                    console.log(err)
                })
                $('#orderRemindModal').modal();
            }
            $scope.remindAffirm= function () {
                console.log($scope.RemindInformation)
                var phone_legal = validation.checkMobile($scope.RemindInformation.phone);
                console.log(phone_legal)
                var email_legal = validation.checkNewEmail($scope.RemindInformation.toEmail);
                console.log(email_legal)
                if(phone_legal==false&&email_legal==false){
                    OrderServices.updateRemindInformation($scope.RemindInformation).then(function(data){
                        $('#orderRemindModal').modal('hide');
                    }, function (err) {
                        console.log(err)
                    })
                }
                else
                {
                    if(phone_legal==false){
                        alert('请正确输入邮箱地址')
                    }
                    else if(email_legal==false){
                        alert('请正确输入电话号码')
                    }
                    else{
                        alert('请输入正确的信息')
                    }
                }
            }

        })
    });
