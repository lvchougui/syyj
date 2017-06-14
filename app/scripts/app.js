// The app/scripts/app.js file, which defines our AngularJS app

var IconIp='http://127.0.0.1:4001/';
var ImgIp='http://127.0.0.1:4000/';
var imgUploadIP='http://127.0.0.1:4000/api/attachment/upload';
var iconUploadIP='http://115.159.81.112:4001/api/attachment/upload';
var localImageIp="http://115.159.81.112:3008/media"
var localExcelIp="http://115.159.81.112:3008"
define(['angular', 'common/controllers',
    'common/services', 'common/filters', 'ng-file-upload',
    'common/directives'
], function (angular) {
    return angular.module('MyApp', ['controllers', 'services',
            'filters', 'directives', 'ui.router', 'ngFileUpload'
        ]).config(function ($httpProvider) {
            $httpProvider.interceptors.push('TokenInterceptor');
        })
        .run(function ($rootScope, $state, $stateParams, $window) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                $rootScope.logout = function(){
                    console.log("======Logout=======");
                    delete $window.sessionStorage.token;
                    $state.go('login');
                }
                $rootScope.user={};
                $rootScope.IconIp=IconIp;

                if(localStorage.headimgurl!='null'){
                    $rootScope.user.headimgurl=localStorage.headimgurl;
                }
                $rootScope.user.company_name=localStorage.company_name;

                //localStorage.company_name=$rootScope.user.company_name;
                //localStorage.headimgurl=$rootScope.user.headimgurl;
                // 允许进入登录页面
                if (toState.name == 'login') {
                    return;
                }

                if (!$window.sessionStorage.token) {
                    console.log("=====>>> 未登录")
                    // 取消默认跳转行为
                    event.preventDefault();
                    // 跳转到登录页
                    $state.go("login", {from: fromState.name, w: 'notLogin'});
                }

            });
        });
});
