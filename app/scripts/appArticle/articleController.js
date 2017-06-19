/**
 * Created by wei on 16/1/12.
 */



define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('ArticleCtrl', function ($scope, ArticleService, $location, errMap, validation, $state, $cacheFactory) {
            $scope.params ={};
            $scope.point=[];
            $scope.count = 0;
            $scope.currentPage = 1;
            $scope.numPages = 1;
            $scope.pageSize = 10;
            $scope.pages = [];
            $scope.pageStart = ($scope.currentPage - 1) * $scope.pageSize + 1;
            $scope.pageEnd = $scope.pageSize;

            var load = function (params) {
                params.page = $scope.currentPage;
                params.size = $scope.pageSize;
                ArticleService.getArticleList(params).then(function (data) {
                    $scope.articles = data.array;
                    $scope.count = data.counts;
                    $scope.numPages = data.counts>0?Math.ceil(data.counts / $scope.pageSize):1;
                    $scope.pageStart = data.counts>0?($scope.currentPage - 1) * $scope.pageSize + 1:0;
                    $scope.pageEnd = $scope.pageSize * $scope.currentPage > data.counts ? data.counts : $scope.currentPage * $scope.pageSize;
                }, function (err) {
                    console.log(err);
                })
            }

            load($scope.params);

            //ArticleService.getCateList().then(function (data) {
            //    $scope.cates = data;
            //    if(data&&data.length>0){
            //        $scope.cateId = data[0].id;
            //        load($scope.cateId);
            //    }
            //}, function (err) {
            //    console.log(err);
            //})
            $scope.getDetail = function (articleId) {
                $state.go("home.articleDetail", {articleId: articleId});
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
                ArticleService.delArticle(articleId).then(function (data) {
                    $scope.articles[item_index].status = 0;
                    console.log("删除成功");
                    $('#delModal').modal('hide');
                }, function (err) {
                    alert(err);
                })
            }

            // 翻页
            $scope.onSelectPage = function (page) {
                $scope.currentPage = page;
                load($scope.params);
            };
            $scope.lookUp=function(){
                $scope.currentPage = 1;
                load($scope.params);
            }

            //$scope.selectCate = function (item) {
            //    $scope.cateId = item.id;
            //    load($scope.cateId);
            //}

        })

        controllers.controller('ArticleDetailCtrl', function ($scope, ArticleService, $stateParams, errMap, $state, validation, $q) {
            $scope.articleId = $stateParams.articleId;
            $scope.article = {};

            ArticleService.getCateList().then(function (data) {
                $scope.cates = data;
                if ($scope.articleId != 0) {
                    ArticleService.getArticleDetail($scope.articleId).then(function(data){
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
                        ArticleService.updateArticle($scope.article).then(function(data){
                            console.log(data)
                            $state.go('home.article');
                        }, function (err) {
                            alert(err);
                        })
                    }else{
                        ArticleService.addArticle($scope.article).then(function(data){
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
