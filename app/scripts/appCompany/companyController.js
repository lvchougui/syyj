/**
 * Created by wei on 16/1/12.
 */



define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('CompanyGoodsCtrl', function ($scope, CompanyService, $location, errMap, validation, $state, $cacheFactory) {
            $scope.cates = [];
            var load = function (cateId) {
                CompanyService.getArticleList(cateId).then(function (data) {
                    $scope.articles = data;
                }, function (err) {
                    console.log(err);
                })
            }
            CompanyService.getCateList().then(function (data) {
                $scope.cates = data;
                if(data&&data.length>0){
                    $scope.cateId = data[0].id;
                    load($scope.cateId);
                }
            }, function (err) {
                console.log(err);
            })
            $scope.getDetail = function (articleId) {
                $state.go("home.companyGoodsDetail", {articleId: articleId});
            }

            var item_index;
            $scope.del = function (index) {
                $scope.notifyContent = '确定要删除这篇文章？';
                item_index = index;
                $('#delModal').modal();
            }

            $scope.deleteArticle = function () {
                var articleId = $scope.articles[item_index].id

                //console.log(delJson)
                CompanyService.delArticle(articleId).then(function (data) {
                    $scope.articles[item_index].status = 0;
                    console.log("删除成功");
                    $('#delModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }

            $scope.selectCate = function (item) {
                $scope.cateId = item.id;
                load($scope.cateId);
            }

        })

        controllers.controller('CompanyGoodsDetailCtrl', function ($scope, CompanyService, $stateParams, errMap, $state, validation, $q) {
            $scope.articleId = $stateParams.productId;
            $scope.article = {};

            CompanyService.getCateList().then(function (data) {
                $scope.cates = data;
                if ($scope.articleId != 0) {
                    CompanyService.getArticleDetail($scope.articleId).then(function(data){
                        console.log(data);
                        $scope.article = data;
                        $scope.cateId = data.cateId;
                        $scope.content = data.detail;
                    })
                }else{
                    $scope.cateId = data[0].id;
                    $scope.article.cateId = data[0].id;
                }
            }, function (err) {
                console.log(err);
            })

            $scope.selectCate = function (item) {
                $scope.cateId = item.id;
                $scope.article.cateId = item.id;
            }

            $scope.save = function(){
                console.log($scope.content);
                if(!$scope.content||$scope.content.length==0){
                    $scope.notifyContent = '请输入文章内容';
                    $('#notifyModal').modal();
                }else{
                    $scope.article.detail = $scope.content;
                    if($scope.articleId!=0){
                        $scope.article.id = $scope.articleId;
                        CompanyService.updateArticle($scope.article).then(function(data){
                            console.log(data)
                            $state.go('home.article');
                        }, function (err) {
                            alert(err);
                        })
                    }else{
                        CompanyService.addArticle($scope.article).then(function(data){
                            console.log(data)
                            $state.go('home.article');
                        }, function (err) {
                            alert(err);
                        })
                    }
                }
            }
        });

    });
