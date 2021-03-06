/**
 * Created by wei on 16/1/12.
 */



define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('ArticleCtrl', function ($scope, ArticleService, $location, errMap, validation, $state, $cacheFactory) {
            $scope.params = {};
            $scope.point = [];
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
                    $scope.numPages = data.counts > 0 ? Math.ceil(data.counts / $scope.pageSize) : 1;
                    $scope.pageStart = data.counts > 0 ? ($scope.currentPage - 1) * $scope.pageSize + 1 : 0;
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
            // 翻页
            $scope.onSelectPage = function (page) {
                $scope.currentPage = page;
                load($scope.params);
            };
            $scope.lookUp = function () {
                $scope.currentPage = 1;
                load($scope.params);
            }

            //$scope.selectCate = function (item) {
            //    $scope.cateId = item.id;
            //    load($scope.cateId);
            //}

        })

        controllers.controller('ArticleDetailCtrl', function ($scope, ArticleService, ProductService, $stateParams, errMap, $state, validation, $q) {
            $scope.files = [];
            $scope.covers = '';
            $scope.uploadImg = '';
            $scope.articleId = $stateParams.articleId;
            $scope.article = {};

            if ($scope.articleId != 0) {
                ArticleService.getArticleDetail($scope.articleId).then(function (data) {
                    console.log(data);
                    $scope.article = data;
                    $scope.covers = $scope.article.cover;
                    $scope.cateId = data.cateId;
                    $scope.content = data.detail;
                })
            }
            var waitDelImg = {
                icon: [],
                img: []
            };

            $scope.files = [];

            $scope.upload = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
                console.log($file)
                if ($file) {
                    $scope.covers = $file;
                    $scope.uploadImg = $file;
                    $scope.article.cover = $scope.covers;
                    if (Object.prototype.toString.call($scope.article.cover) == "[object String]") {
                        waitDelImg.img.push($scope.article.cover);
                        console.log('ds')
                    }
                }
            }

            $scope.save = function () {
                console.log($scope.content);
                if (!$scope.article.cover || $scope.article.cover == '') {
                    $scope.notifyContent = '请上传文章首图';
                    $('#notifyModal').modal();
                    return;
                }
                if ($scope.article.summary == '') {
                    $scope.notifyContent = '请输入文章简介';
                    $('#notifyModal').modal();
                    return;
                }
                if (!$scope.content || $scope.content.length == 0) {
                    $scope.notifyContent = '请输入文章内容';
                    $('#notifyModal').modal();
                    return
                }
                $scope.article.detail = $scope.content;
                if($scope.uploadImg&&$scope.uploadImg!=''){
                    var uploadImgPromise = ProductService.uploadImg(imgUploadIP,  $scope.covers);
                    uploadImgPromise.then(function (res) {
                        console.log(res);
                        $scope.article.cover = res.data.path;
                        if ($scope.articleId != 0) {
                            $scope.article.id = $scope.articleId;
                            ArticleService.updateArticle($scope.article).then(function (data) {
                                console.log(data)
                                $state.go('home.article');
                            }, function (err) {
                                alert(err);
                            })
                        } else {
                            ArticleService.addArticle($scope.article).then(function (data) {
                                console.log(data)
                                $state.go('home.article');
                            }, function (err) {
                                alert(err);
                            })
                        }
                    }, function (err) {
                        console.log(err);
                    }, function (update) {
                        console.log(update);
                    });
                }else{
                    if ($scope.articleId != 0) {
                        $scope.article.id = $scope.articleId;
                        ArticleService.updateArticle($scope.article).then(function (data) {
                            console.log(data)
                            $state.go('home.article');
                        }, function (err) {
                            alert(err);
                        })
                    } else {
                        ArticleService.addArticle($scope.article).then(function (data) {
                            console.log(data)
                            $state.go('home.article');
                        }, function (err) {
                            alert(err);
                        })
                    }
                }


            }

            function addSave(){

            }
        });

    });
