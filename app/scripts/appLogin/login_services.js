// app的相关服务配置文件
define(['common/services'],
  function(services) {
    services.factory('UserService', [
      function() {
        return {
          getUser: function() {
            return 'testUserssssssssssssssss';
          }
        };
      }]);
  });