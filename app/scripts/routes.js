define(['app'], function (app) {
    // body...
    app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {

//            $routeProvider.when('/', '/#/login');
//            $urlRouterProvider.when('/', '/home/category');
            $urlRouterProvider.when('', '/login');
//            $locationProvider.html5Mode(true);
            $stateProvider

                .state("login", {
                    url: "/login",
                    templateUrl: 'login.html',
                    controller: 'LoginCtrl'
                })
                .state("home", {
                    url: "/home", abstract: true, templateUrl: 'home.html'

                })
                .state("home.indexconfig", {
                    url: "/indexconfig",
                    views: {
                        '': {
                            templateUrl: 'views/store/home.preStore.html',
                            controller: 'PreStoreCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })

                .state("home.cert", {
                    url: "/cert",
                    views: {
                        '': {
                            templateUrl: 'views/tplCertificate/certList.html',
                            controller: 'CertCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.certDetail", {
                    url: "/certDetail/{certId}",
                    views: {
                        '': {
                            templateUrl: 'views/tplCertificate/certDetail.html',
                            controller: 'CertDetailCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.article", {
                    url: "/article",
                    views: {
                        '': {
                            templateUrl: 'views/tplArticle/articleList.html',
                            controller: 'ArticleCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.articleDetail", {
                    url: "/articleDetail/{articleId}",
                    views: {
                        '': {
                            templateUrl: 'views/tplArticle/articleDetail.html',
                            controller: 'ArticleDetailCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.productList", {
                    url: "/productList",
                    views: {
                        '': {
                            templateUrl: '../views/tplProduct/productList.html',
                            controller: 'ProductListCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.productDetail", {
                    url: "/productDetail/{productId}",
                    views: {
                        '': {
                            templateUrl: 'views/tplProduct/productDetail.html',
                            controller: 'ProductDetailCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
               
                .state("home.operateInstruction", {
                    url: "/operateInstruction",
                    views: {
                        '': {
                            templateUrl: 'views/operateInstruction/home.operate.html',
                            controller:'updateCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html',
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.cate", {
                    url: "/cate",
                    views: {
                        '': {
                            templateUrl: 'views/tplCate/cateList.html',
                            controller: 'CateCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.addCate", {
                    url: "/addCate",
                    views: {
                        '': {
                            templateUrl: 'views/tplCate/addCate.html',
                            controller: 'AddCateCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
        }
    ]);
});
