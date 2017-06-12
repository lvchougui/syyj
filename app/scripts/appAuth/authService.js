define(['common/services'], function (services) {

    services.factory('AuthService', function ($cookieStore, $http) {

        var _token;
        return {
            getToken: function () {
                return $cookieStore.get('token');
            },
            setToken: function (token) {
                _token = token;
                $cookieStore.put('token', token);
            },
            auth: function (cb) {
                var token = $cookieStore.get('token');
                if (!token) {
                    return cb(false);
                }
            },
            remove: function () {
                $cookieStore.remove('token', _token);
            }
        }

    });

    services.factory('TokenInterceptor', function ($q, $window, $location) {

        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
            requestError: function(rejection){
                return $q.reject(rejection);
            },
            response: function(response) {
                if(response != null && response.status == 200 && $window.sessionStorage.token){
                }
                return response || $q.when(response);
            },

            responseError: function(rejection) {
                if(rejection != null && rejection.status === 401 && $window.sessionStorage.token){
                    delete $window.sessionStorage.token;

                    console.log("======>>>> TokenInterceptor resonseError");
                    $location.path("/login");
                }

                return $q.reject(rejection);
            }
        }

    });

});