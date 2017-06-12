// the app/scripts/main.js file, which defines our RequireJS config
require.config({
    baseUrl: 'scripts',
    paths: {
        'jquery': '../lib/bower_components/jquery/dist/jquery',
        'angular': '../lib/angular.min',
        'angular-ui-router': '../lib/bower_components/angular-ui-router/release/angular-ui-router.min',
        'domReady': '../lib/domReady',
        'bootstrap': '../lib/bower_components/bootstrap/dist/js/bootstrap',
        'siteApp': '../../media/js/app',
        'login': '../../media/js/login',
        'uniform': '../../media/js/jquery.uniform.min',
        'validate': '../../media/js/jquery.validate.min',
        'ng-file-upload': '../lib/bower_components/ng-file-upload/ng-file-upload-all',
        ueditorConfig: '../../ueditor/ueditor.config',
        ueditorAll: '../../ueditor/ueditor.all',
        angularUeditor: '../lib/bower_components/angular-ueditor/dist/angular-ueditor'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui-router': [ 'angular' ],
        'bootstrap': ['jquery'],
        'uniform': ['jquery'],
        'validate': ['jquery'],
        'login': {
            deps: ['validate'],
            exports: 'Login'
        }, ueditorConfig: {
            exports: 'ueditorConfig'
        },
        ueditorAll: {
            deps: ['ueditorConfig'],
            exports: 'ueditorAll'
        },
        angularUeditor: {
            deps: [ 'angular', 'ueditorConfig', 'ueditorAll'],
            exports: 'angularUeditor'
        }

    }
});
require([
    'angular'
    , 'domReady'
    , 'login'
    , 'angular-ui-router'
    , 'bootstrap'
    , 'app'
    , 'siteApp'
    , 'uniform'
    , 'validate'
    ,'ueditorConfig'
    ,'ueditorAll'
    ,'angularUeditor'
    , 'routes'
    , 'appLogin/controllers/loginController'

],
    function (angular, domReady, Login) {
        'use strict';

        domReady(function () {
            angular.bootstrap(document, ['MyApp']);

            console.log("=======>>> Login Page DomReady！");
            // The following is required if you want AngularJS Scenario tests to work
            $('html').addClass('ng-app: MyApp');

        });
    }
);
