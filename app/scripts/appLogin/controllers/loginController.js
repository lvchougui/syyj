define(['common/controllers', 'appLogin/login_services'],
    function(controllers) {
        controllers.controller('RootCtrl', ['$scope', 'UserService',
            function($scope, UserService) {
                $scope.name = UserService.getUser();
            }
        ]);
    });
