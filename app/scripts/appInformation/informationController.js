/**
 * Created by wei on 16/3/26.
 */
/**
 * Created by zhaohui on 15-5-8.
 */
define(['common/controllers', 'appOrder/orderServices', 'moment', 'domReady', 'config'],
    function (controllers,OrderServices, moment, domReady, SiteConfig) {
        controllers.controller('InformationCtrl',function ($scope, InformationServices,CompanyService) {
            function code(data){
                var indexStr=data.substring(0,3);
                var lastStr=data.substring(data.length-3,data.length);
                var middle='';
                for(var i=0;i<data.length-6;i++){
                    middle+='*';
                }
                return indexStr+middle+lastStr;
            }

            InformationServices.getAccountInformation().then(function(res){
                console.log(res)
                $scope.information=res.result[0];
                $scope.phone=code($scope.information.company_phone);
                $scope.account=code($scope.information.company_account);
                try{
                    localStorage.company_name=$scope.information.company_name;
                    localStorage.headimgurl=$scope.information.headimgurl;
                }catch(e){
                    console.log(e);
                }
                if($scope.information.headimgurl)$scope.covers=IconIp+$scope.information.headimgurl;
            },function(err){
                alert('暂时无法获取供应商信息');
                console.log(err);
            })

            $scope.point=[];
            $scope.count = 0;
            $scope.currentPage = 1;
            $scope.numPages = 1;
            $scope.pageSize = 10;
            $scope.pages = [];
            $scope.pageStart = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.pageEnd = $scope.pageSize;

            $scope.params={
                company_id:localStorage.company_id
            }

            function load(params) {
                params.page = $scope.currentPage;
                params.size = $scope.pageSize;
                InformationServices.getWithdrawDetail(params).then(function(data){
                    $scope.withDrawDetails=data.result;
                    $scope.count = data.counts;
                    $scope.numPages = data.counts>0?Math.ceil(data.counts / $scope.pageSize):1;
                    $scope.pageStart = data.counts>0?($scope.currentPage - 1) * $scope.pageSize + 1:0;
                    $scope.pageEnd = $scope.pageSize * $scope.currentPage > data.counts ? data.counts : $scope.currentPage * $scope.pageSize;
                    console.log(data);

                },function(err){
                    alert('获取提现详细纪录出错');
                    console.log(err);
                })
            }

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

            load($scope.params);
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

        $scope.updateNickName=function(){
            $('#nickNameNotifyModal').modal();
        }

        $scope.confirmNickName=function(){
            $scope.information.company_nickname=$scope.company_nickname;
            $("button").removeAttr("disabled");
            $('#nickNameNotifyModal').modal('hide');
        }

            $scope.updateSummary=function(){
                $('#summaryNotifyModal').modal();
            }

            $scope.confirmSummary=function(){
                $scope.information.company_introduction=$scope.summary;
                $("button").removeAttr("disabled");
                $('#summaryNotifyModal').modal('hide');
            }

            var icon=[];
            $scope.save=function(){
                $("button").attr("disabled","disabled");
                var arr=[$scope.covers];
                var iconResize= CompanyService.resize(arr,300,300,0.3,'1:1');
                iconResize.then(function(data){
                    $scope.information.headimgurl=arr[0];
                    uploadIcon(function(err,data){
                        if(err){
                            alert('图片上传出错')
                        }else{
                            chgInformation();
                        }
                    })

                },function(err){
                    console.log(err);
                })
            }

            function uploadIcon(cb){
                if(icon.length!=0||(Object.prototype.toString.call($scope.information.headimgurl) != "[object String]")){
                    var uploadIconPromise=CompanyService.uploadImg(iconUploadIP,$scope.information.headimgurl);
                    uploadIconPromise.then(function(res){
                        $scope.information.headimgurl=res.data.path;
                        cb(null,true);
                    },function(err){
                        cb(true,null);
                        console.log(err);
                    },function(update){
                        console.log(update);
                    });
                }else {
                    console.log($scope.information.headimgurl);
                    if($scope.information.headimgurl)$scope.information.headimgurl=$scope.information.headimgurl.substring(IconIp.length,$scope.information.headimgurl.length);
                    cb(null,true);
                }
            }

            function chgInformation(){
                InformationServices.chgAccountInformation($scope.information).then(function(res){
                    location.reload();
                },function(err){
                    $("button").removeAttr("disabled");
                    console.log(err);
                    alert('修改出错')
                })
            }

            $scope.upload=function($files, $file){
                if($file){
                    $("button").removeAttr("disabled");
                    $scope.covers=$file;
                    if(Object.prototype.toString.call($scope.information.headimgurl) == "[object String]"){
                        icon.push($scope.information.headimgurl);
                    }
                }
            }
        })
    });
