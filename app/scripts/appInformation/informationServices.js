/**
 * Created by wei on 16/3/26.
 */

define(['common/services'],
    function (services) {
        services.factory('InformationServices', function ($http,$q) {
            var account={
                company_usrname:'test',
                company_id:localStorage.company_id,
                headimgurl:'',
                company_nickname:'有农合作伙伴',
                company_integration:0,
                company_money:1001,
                company_passwd:'test',
                company_account:6222023700020857837,
                company_phone:15301546841,
                company_pay_tag:0,
                account_changed:0
            };





            return {
                getAccountInformation: function () {
                    account.company_id=localStorage.company_id;
                    var defer = $q.defer();
                    $http(
                        {   method:"get",
                            url:'/companyPc/api/account/getAccount/'+account.company_id
                        }
                    ).success(function(data){
                            defer.resolve(data);
                        }).error(function(err){
                            defer.reject('获取账号信息错误');
                        });
                    return defer.promise;
                },
                chgAccountInformation: function (data) {
                    data.company_id=localStorage.company_id
                    var defer = $q.defer();
                    $http(
                        {   method:"post",
                            url:'/companyPc/api/account/chgAccount',
                            data:data
                        }
                    ).success(function(data){
                            defer.resolve(data);
                        }).error(function(err){
                            defer.reject('CHANGE_FAILURE');
                        });
                    return defer.promise;
                },
                getWithdrawDetail:function(params){
                    var defer = $q.defer();
                    $http(
                        {   method:"get",
                            url:'/companyPc/api/account/getWithdrawDetail/'+params.company_id+'/'+params.page+'/'+params.size
                        }
                    ).success(function(data){
                            defer.resolve(data);
                        }).error(function(err){
                            defer.reject('FAILURE');
                        });
                    return defer.promise;
                }
            };
        });
    });