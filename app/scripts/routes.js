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
                .state("home.store", {
                    url: "/store",
                    views: {
                        '': {
                            templateUrl: 'views/store/home.store.html',
                            controller: 'StoreCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })

                .state("home.delivery_charge", {
                    url: "/deliveryCharge",
                    views: {
                        '': {
                            templateUrl: 'views/tplDeliveryCharge/home.delivery_charge.html',
                            controller: 'DeliveryChargeCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.addTemplet", {
                    url: "/addTemplet/{deliveryTemplateId}",
                    views: {
                        '': {
                            templateUrl: 'views/tplDeliveryCharge/addTemplet.html',
                            controller: 'AddDeliveryChargeCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })

                .state("home.order", {
                    url: "/order/page/{page}",
                    views: {
                        '': {
                            templateUrl: 'views/tplOrder/home.order.html',
                            controller: 'OrderCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.salesPromotion", {
                    url: "/sales/page/{page}",
                    views: {
                        '': {
                            templateUrl: 'views/tplsales/home.salesPromotion.html',
                            controller: 'SalesCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.wholesale", {
                    url: "/pin/page/{page}",
                    views: {
                        '': {
                            templateUrl: '../views/tplPintuan/home.wholesale.html',
                            controller: 'PinCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.wholesaleDetail", {
                    url: "/wholesaleDetail/{activity_id}",
                    views: {
                        '': {
                            templateUrl: 'views/tplPintuan/wholesaleDetail.html',
                            controller: 'PinDetailCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.orderDetail", {
                    url: "/order/detail/{order_id}",
                    views: {
                        '': {
                            templateUrl: 'views/tplOrder/home.order.detail.html',
                            controller: 'OrderDetailCtrl'
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
                            controller: 'CompanyGoodsCtrl'
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
                            controller: 'CompanyGoodsDetailCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.updateInformation", {
                    url: "/updateInformation",
                    views: {
                        '': {
                            templateUrl: '../views/tplProduct/updateInformation.html',
                            controller:'updateCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.information", {
                    url: "/information",
                    views: {
                        '': {
                            templateUrl: 'views/tplInformation/home.information.html',
                            controller: 'InformationCtrl'
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
                .state("home.cateStore", {
                    url: "/cateStore",
                    views: {
                        '': {
                            templateUrl: 'views/tplDeliveryTime/home.delivery_time.html',
                            controller: 'DeliveryTimeCtrl'
                        }, 'sidebar': {
                            templateUrl: 'views/common/sidebar.html'
                        },
                        'footer': {
                            templateUrl: 'views/common/footer.html'
                        }
                    }
                })
                .state("home.addDeliveryTime", {
                    url: "/addDeliveryTime",
                    views: {
                        '': {
                            templateUrl: 'views/tplDeliveryTime/addDeliveryTime.html',
                            controller: 'AddDeliveryTimeCtrl'
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
