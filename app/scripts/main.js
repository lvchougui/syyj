// the app/scripts/main.js file, which defines our RequireJS config
require.config({
    paths: {
        'jquery': 'lib/bower_components/jquery/dist/jquery.min',
        'angular': 'lib/bower_components/angular/angular.min',
        'angular-ui-router': 'lib/bower_components/angular-ui-router/release/angular-ui-router.min',
        'domReady': 'lib/domReady',
        'moment': 'lib/bower_components/moment/min/moment.min',
        'bootstrap': 'lib/bower_components/bootstrap/dist/js/bootstrap',
        'datepicker-locale': 'lib/bower_components/bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min',
        'datetimepicker-locale': 'lib/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN',
        'datepicker': 'lib/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker',
        'datetimepicker': 'lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker',
        'ng-file-upload': 'lib/ng-file-upload',
        'multiselect': 'lib/bower_components/bootstrap-multiselect/dist/js/bootstrap-multiselect',
        'config': 'common/config',
        'siteApp': '../media/js/app',
        'login': '../media/js/login',
        'uniform': '../media/js/jquery.uniform.min',
        'validate': '../media/js/jquery.validate.min',
        'wysiwyg': 'lib/bootstrap-wysiwyg',
        'hotkey': 'lib/external/jquery.hotkeys',
        'xls': 'lib/xls',
        'XLSX': 'lib/xlsx',
        'jszip': 'lib/jszip',
        ueditorConfig: '../ueditor/ueditor.config',
        ueditorAll: '../ueditor/ueditor.all',
        ueditorLang: '../ueditor/lang/zh-cn/zh-cn',
        angularUeditor: 'lib/bower_components/angular-ueditor/dist/angular-ueditor'
    },
    shim: {
        'angular': {
            exports: 'angular'
        }
        , 'angular-ui-router': ['angular']
        , 'bootstrap': ['jquery']
        , 'ng-file-upload': ['angular']
        , 'datepicker': ['jquery']
        , 'datetimepicker': ['jquery']
        , 'datepicker-locale': ['datepicker']
        , 'datetimepicker-locale': ['datetimepicker']
        , 'multiselect': ['bootstrap']
        , 'config': {
            exports: 'SiteConfig'
        }
        , 'uniform': ['jquery'],
        'validate': ['jquery'],
        'login': {
            deps: ['validate'],
            exports: 'Login'
        }
        , 'wysiwyg': ['bootstrap', 'hotkey']
       , ueditorConfig: {
            exports: 'ueditorConfig'
        },
        ueditorAll: {
            deps: ['ueditorConfig'],
            exports: 'ueditorAll'
        },
        ueditorLang:{
            deps: ['ueditorAll'],
            exports:'ueditorLang',
        },
        angularUeditor: {
            deps: [ 'angular', 'ueditorConfig', 'ueditorAll','ueditorLang'],
            exports: 'angularUeditor'
        }
    }
});
require([
        'angular',
        'domReady',
        'login',
        'angular-ui-router',
        'ng-file-upload',
        'bootstrap',
        'app',
        'moment',
        'xls',
        'XLSX',
        'jszip',
        'routes',
        'common/angular_directives/ngPagination',
        'appLogin/login_services',
        'appLogin/loginController',
        'appProduct/productService',
        'appProduct/productController',
        'appDeliveryCharge/deliveryChargeController',
        'appDeliveryCharge/deliveryChargeService',
        'appCate/cateController',
        'appCate/cateService',
        'appOrder/orderServices',
        'appOrder/orderController',
        'appInformation/informationServices',
        'appStore/storeController',
        'appStore/storeService',
        'appInformation/informationController',
        'appSales/salesController',
        'appSales/salesService',
        'appPintuan/pinController',
        'appPintuan/pinService',
        'appArticle/articleController',
        'appArticle/articleService',
        'appCertificate/certController',
        'appCertificate/certService',
        'datepicker',
        'datetimepicker',
        'datepicker-locale',
        'datetimepicker-locale',
        'appAuth/authService',
        'multiselect',
        'config'
        , 'siteApp'
        , 'uniform'
        , 'validate'
        ,'ueditorConfig'
        ,'ueditorAll'
        ,'ueditorLang'
        ,'angularUeditor'
    ],
    function (angular, domReady, Login) {
        'use strict';

        domReady(function () {
            angular.bootstrap(document, ['MyApp']);

            // The following is required if you want AngularJS Scenario tests to work
            $('html').addClass('ng-app: MyApp');

        });
    }
);
