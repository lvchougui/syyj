define(['common/controllers', 'domReady'],
    function (controllers, domReady) {
        controllers.controller('LoginCtrl', function ($scope, $http, $rootScope, $state, $window) {
                $scope.loginForm = {};

                var login = function () {

                    var username = $scope.loginForm.username;
                    var password = $scope.loginForm.password;

                    console.log("=== Username : "+username+" , Password : "+password);
                    if (username && password) {
                        console.log("======Login=======");
                        $http.post('/companyPc/api/user/login', {username: username, password: password}).success(function (result) {

                            $rootScope.user.company_id = result.result.company_id;
                            $rootScope.user.headimgurl = result.result.headimgurl;
                            $rootScope.user.company_name = result.result.company_name;
                            $rootScope.user.company_type = result.result.company_type;
                            $rootScope.logout = function(){
				    delete $window.sessionStorage.token;
                                $state.go('login');
                            }
                            $window.sessionStorage.token = "token";
                            console.log($rootScope.user);

                            try{
                                localStorage.company_id=$rootScope.user.company_id;
                                localStorage.company_name=$rootScope.user.company_name;
                                localStorage.headimgurl=$rootScope.user.headimgurl;
                                localStorage.company_type=$rootScope.user.company_type;
//HEAD

//
                                localStorage.currentPage=1;
// yunfei
                            }catch(e){
                                console.log(e);
                            }
                            console.log("$window.sessionStorage.token = "+$window.sessionStorage.token);
                            $state.go('home.preStore');
                        }).error(function (error) {
                                console.log(error);
                                $scope.notifyContent = error.error;
                                $('#notifyModal').modal();
                            });
                    }
                }

                domReady(function () {
                    var handleUniform = function () {
                        console.log(jQuery());
                        if (!jQuery().uniform) {
                            console.log("!jQuery().uniform return")
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
                    $('.login-form').validate({
                        errorElement: 'label', //default input error message container
                        errorClass: 'help-inline', // default input error message class
                        focusInvalid: false, // do not focus the last invalid input
                        rules: {
                            username: {
                                required: true
                            },
                            password: {
                                required: true
                            },
                            remember: {
                                required: false
                            }
                        },

                        messages: {
                            username: {
                                required: "用户名不能为空."
                            },
                            password: {
                                required: "密码不能为空."
                            }
                        },

                        invalidHandler: function (event, validator) { //display error alert on form submit
                            $('.alert-error', $('.login-form')).show();
                        },

                        highlight: function (element) { // hightlight error inputs
                            $(element)
                                .closest('.control-group').addClass('error'); // set error class to the control group
                        },

                        success: function (label) {
                            label.closest('.control-group').removeClass('error');
                            label.remove();
                        },

                        errorPlacement: function (error, element) {
                            error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
                        },

                        submitHandler: function (form) {

                            console.log("=== submit ==")
                            console.log($scope.loginForm.username);

                            login();
                        }
                    });

                    $('.login-form input').keypress(function (e) {
                        if (e.which == 13) {
                            if ($('.login-form').validate().form()) {
                                //window.location.href = "index.html";
                                login();
                            }
                            return false;
                        }
                    });
//                    Login.init();

                });

            }
        );
    });
