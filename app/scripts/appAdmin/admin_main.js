// the app/scripts/main.js file, which defines our RequireJS config
require.config({
    paths: {
        'jquery': '../lib/bower_components/jquery/dist/jquery',
        'angular': '../lib/angular.min',
        'angular-ui-router': '../lib/bower_components/angular-ui-router/release/angular-ui-router.min',
        'domReady': '../lib/domReady',
        'bootstrap':'../lib/bower_components/bootstrap/dist/js/bootstrap',
        'siteApp':'../../media/js/app',
        'login':'../../media/js/login',
        'uniform':'../../media/js/jquery.uniform.min',
        'validate':'../../media/js/jquery.validate.min'

    },
    shim: {
        'angular': {
            exports: 'angular'
        }
        ,'angular-ui-router':  [ 'angular' ]
        ,'bootstrap':['jquery']
        ,'uniform':['jquery']
        ,'validate':['jquery']
        ,'login':['validate']

    }
});
require([
    'angular',
    'domReady',
    'login',
    'angular-ui-router',
    'bootstrap',
    'app',
    'siteApp',

    // Any individual controller, service, directive or filter file
    // that you add will need to be pulled in here.
    'routes',
    'appLogin/login_services',
    'appLogin/controllers/loginController'

],
    function (angular, domReady, Login) {
        'use strict';

        domReady(function () {
            angular.bootstrap(document, ['MyApp']);

            // The following is required if you want AngularJS Scenario tests to work
            $('html').addClass('ng-app: MyApp');
            var handleUniform = function () {
                if (!jQuery().uniform) {
                    return;
                }
                var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
                if (test.size() > 0) {
                    test.each(function () {
                        if ($(this).parents(".checker").size() == 0) {
                            $(this).show();
                            $(this).uniform();
                        }
                    });
                }
            };
            handleUniform();
            Login.init();

        });
    }
);
