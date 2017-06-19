define(['common/services','moment'],
    function (services,moment) {
        services.factory('CompanyService', function ($http,$q,Upload,$cacheFactory) {
            var cache =$cacheFactory('cache1');
            return{

                getCache:function() {
                    return cache;
                },

                getCateList:function(){
                    var deferred = $q.defer();
                    $http.get('/api/cate/getCateList').success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },

                getArticleList:function(cateId){
                    var deferred = $q.defer();
                    $http.get('/api/article/getArticleList/'+cateId).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },

                delArticle:function(data){
                    var deferred = $q.defer();
                    $http.put('/api/article/delArticle/'+data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },

                getArticleDetail:function(data){
                    var deferred = $q.defer();
                    $http.get('/api/article/getArticleDetail/'+data).success(function(res){
                        console.log(res);
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },

                updateArticle:function(data){
                    var deferred = $q.defer();
                    $http.post('/api/article/updateArticle',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },
                addArticle:function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    $http.post('/api/article/addArticle',data).success(function(res){
                        deferred.resolve(res);
                    }).error(function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                },


                resize: function (data,width,height,quantity,ratio) {
                    console.log(ratio);
                    var deferred = $q.defer();

                    var k=0;
                    if(data.length!=0){
                        for(var i=0;i<data.length;i++){
                            var item=data[i];
                            if(!item){
                                k++;
                                if(i==data.length-1){
                                    deferred.resolve('success');
                                }
                            }else if(Object.prototype.toString.call(item)=="[object Undefined]"){
                                k++;
                            if(i==data.length-1){
                                deferred.resolve('success');
                            }
                            }
                            else if(!item.resize&&(Object.prototype.toString.call(item) != "[object String]")){
                                item.number=k;
                                Upload.resize(item,width,height,quantity,'image/jpeg',ratio,true).then(function(resizedFile){
                                    data[resizedFile.number]=resizedFile;
                                    resizedFile.resize=true;
                                    k++;
                                    if(i==k){
                                        deferred.resolve('success');
                                    }
                                });
                            }else{
                                k++;
                                if(i==data.length-1){
                                    deferred.resolve('success');
                                }
                            }
                        }
                    }else{
                        deferred.resolve('success');
                    }

                    return deferred.promise;
                },
                delImg:function(icon,img){
                    console.log(icon);
                    console.log(img);
                    var defer = $q.defer();
                    console.log({data:icon});
                    if(icon&&(icon.length!=0)){
                        $http(
                            {method:"post",
                                url:IconIp+"api/attachment/del",
                                contentType: "application/json;charset=utf-8",
                                data: JSON.stringify({data:icon})
                                }
                        ).success(function(res){
                                defer.resolve(res);
                            }).error(function(err){
                                defer.reject('删除失败')
                            });
                    }else{
                        defer.resolve('不需要删除icon');
                    }
                    if(img&&(img.length!=0)){
                        console.log({data:img});
                        $http(
                            {method:"post",
                                url:ImgIp+"api/attachment/del",
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify({data:img})
                            }
                        ).success(function(res){
                                defer.resolve(res);
                            }).error(function(err){
                                defer.reject('删除失败')
                            });
                    }else{
                        defer.resolve('不需要删除img');
                    }
                    return defer.promise;
                },

                uploadImg:function(url,param){
                    var deferred = $q.defer();
                    Upload.upload({
                        url: url,
                        data: {files:param}
                    }).then(function (resp) {
                        deferred.resolve(resp);
                    }, function (err) {
                        deferred.reject(err.status);
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        //console.log('progress: ' + progressPercentage + '% ');
                    });
                    return deferred.promise;
                },
                getCities:function(cb){
                    $http.get('/companyPc/api/goods/getCities').success(function(data){
                        cb(null, data)
                    }).error(function(err){
                        cb(err, null)
                    })
                },
                getCitiesByProvinceId:function(data,cb){
                    $http.get('/companyPc/api/goods/getCitiesByProvinceId/'+data).success(function(data){
                        cb(null, data.results)
                    }).error(function(err){
                        cb(err, null)
                    })
                },
                getProvinces:function(cb){
                    $http.get('/companyPc/api/goods/getProvinces').success(function(data){
                        cb(null, data.results)
                    }).error(function(err){
                        cb(err, null)
                    })
                },
                getCity:function(data,cb){
                    $http.get('/companyPc/api/goods/getCity/'+data).success(function(data){
                        cb(null, data)
                    }).error(function(err){
                        cb(err, null)
                    })
                },
                getDistrictsByCityId:function(data,cb){
                    $http.get('/companyPc/api/goods/getDistricts/'+data).success(function(data){
                        cb(null, data)
                    }).error(function(err){
                        cb(err, null)
                    })
                },


            }
        });
        services.factory('validation', function() {
            return {
//HEAD
                checkTime:function(time){
                    console.log(moment(time));
                    console.log(moment(time)<moment())
                    if (moment(time)<moment()) {
                        return 'PRE_TIME_INVALIDATE';
                    }
                    return false;
                },
                checkSalePriceHgLowestPrice:function(price,lowestPrice){
                    console.log("检验价格啊");
                    console.log(price);
                    console.log(lowestPrice);
                    if (parseInt(price)<parseInt(lowestPrice)) {
                        console.log("检验价格啊");

                        return 'PRICE_INVALIDATE';
                    }
                    return false;
                },
                checkRepertory_place:function(repertory_place){
                    console.log(repertory_place)
                    console.log(!repertory_place);

                    if (!repertory_place ) {
                        return 'REPERTORY_NULL';
                    }
                    return false;
                },
                checkActivityType:function(activity){
                    if (!activity || !activity.length) {
                        return 'ACTIVITY_NULL';
                    }
                    return false;
                },
                checkDiscount:function(discount){
                    console.log(parseFloat(discount)>1);
                    if (parseFloat(discount)>1) {
                        return 'DISCOUNT_INVALIDATE';
                    }
                    if(!discount || isNaN(discount)){
                        return 'DISCOUNT_ERR'
                    }
                    return false;
                },
                checkSalePrice:function(salePrice,price){
                    console.log(parseInt(salePrice)<parseInt(price));
                    if (parseInt(salePrice)<parseInt(price)) {
                        return 'PRICE_LG_SALEPRICE';
                    }
                    if( isNaN(price)){
                        return 'PRICE_ERROE'
                    }
                    return false;
                },
                checkQuality:function(quality,init){
                    if (parseInt(quality)<parseInt(init)) {
                        return 'QUALITYHGINT';
                    }
                    return false;
                },
//
                checkTempletaName:function(name){
                    if (!name || !name.length) {
                        return 'TEMPLATE_NULL';
                    }
                    return false;
                },
                //检查起步件数(默认运费)
                checkInitCases:function(param){
                    param=param.toString();
                    if(!param||!param.length){
                        return 'INIT_CASES_NULL'
                    }
                    if(!param || !param.match(/^[1-9][0-9]*$/)){
                        return 'INIT_CASES_INVALID';
                    }
                    return false;
                },
                //检查起步运费(默认运费)
                checkInitCharge:function(param){
                    param=param.toString();
                    if(!param||!param.length){
                        return 'INIT_CHARGE_NULL'
                    }
                    if(!param || !param.match(/(^[1-9][0-9]*(.[0-9]{1,2})?$)|(^[0](.[0-9]{1,2})?$)/)){
                        return 'INIT_CHARGE_INVALID';
                    }
                    return false;
                },
                //检查步长(默认运费)
                checkStepCases:function(param){
                    param=param.toString();
                    if(!param||!param.length){
                        return 'STEP_NULL'
                    }
                    if(!param || !param.match(/^[1-9][0-9]*$/)){
                        return 'STEP_INVALID';
                    }
                    return false;
                },
                //检查每一步需要增加的运费(默认运费)
                checkStepCharge:function(param){
                    param=param.toString();
                    if(!param||!param.length){
                        return 'ADD_CHARGE_NULL'
                    }
                    if(!param || !param.match(/(^[1-9][0-9]*(.[0-9]{1,2})?$)|(^[0](.[0-9]{1,2})?$)/)){
                        return 'ADD_CHARGE_INVALID';
                    }
                    return false;
                },
                checkShippingTempletaName:function(name){
                    if (!name || !name.length) {
                        return 'SHIPPING_TEMPLATE_NAME_NULL';
                    }
                    return false;
                },
                //检查起步件数(指定城市)
                checkFirstCases:function(param){
                    param=param.toString();
                    if(!param||!param.length){
                        return 'FIRST_CASES_NULL'
                    }
                    if(!param || !param.match(/^[1-9][0-9]*$/)){
                        return 'FIRST_CASES_INVALID';
                    }
                    return false;
                },
                //检查起步运费(指定城市)
                checkFirstCharge:function(param){
                    param=param.toString();
                    if(!param||!param.length){
                        return 'FIRST_CHARGE_NULL'
                    }
                    if(!param || !param.match(/(^[1-9][0-9]*(.[0-9]{1,2})?$)|(^[0](.[0-9]{1,2})?$)/)){
                        return 'FIRST_CHARGE_INVALID';
                    }
                    return false;
                },
                //检查步长(指定城市)
                checkContinueCases:function(param){
                    param=param.toString();
                    if(!param||!param.length){
                        return 'CONTINUE_CASES_NULL'
                    }
                    if(!param || !param.match(/^[1-9][0-9]*$/)){
                        return 'CONTINUE_CASES_INVALID';
                    }
                    return false;
                },
                //检查每一步需要增加的运费(指定城市)
                checkContinueCharge:function(param){
                    param=param.toString();
                    if(!param||!param.length){
                        return 'CONTINUE_CHARGE_NULL'
                    }
                    if(!param || !param.match(/(^[1-9][0-9]*(.[0-9]{1,2})?$)|(^[0](.[0-9]{1,2})?$)/)){
                        return 'CONTINUE_CHARGE_INVALID';
                    }
                    return false;
                },
                checkShippingCondition:function(param){
                    param=param.toString();
                    if(!param||!param.length){
                        return 'SHIPPING_NULL'
                    }
                    if(!param || !param.match(/^[1-9][0-9]*$/)){
                        return 'SHIPPING_INVALID';
                    }
                    return false;
                },
                checkCities:function(param){
                param=param.toString();
                if(!param||!param.length ||param=="未选择城市"){
                    return 'CITIES_NULL'
                }
                    return false;
                 },
//yunfei
                checkNewEmail:function(email){
                    console.log('checkEmail')
                    if (!email || !email.length) {
                        return 'EMAIL_NULL';
                    }
                    if (!(email)
                            .match(/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/)) {
                        return 'EMAIL_INVALID';
                    }
                    return false;
                },
                checkMobileAgain:function(mobile,oldmobile){
                    if (!mobile || !mobile.length) {
                        return 'MOBILE_NULL';
                    }
                    if (!('' + mobile)
                            .match(/^[1][3|4|5|7|8][0-9]{9}$/)) {
                        return 'MOBILE_INVALID';
                    }
                    if(mobile!=oldmobile){
                        return 'MOBILE_AGAIN_FAILURE';
                    }
                    return false;
                },
                checkUsernameAgain:function(username,oldUsername){
                    if (!username || !username.length) {
                        return 'USER_NAME_NULL';
                    }
                    if (username!=oldUsername) {
                        return 'USER_AGAIN_FAILURE';
                    }
                    return false;
                },
                checkAccount:function(account){
                    if (!account || !account.length) {
                        return 'ACCOUNT_NEW_NULL';
                    }
                    if(!this.checkBank(account)){
                        return 'ACCOUNT_NEW_ERROR';
                    }
                    return false;
                },
                checkAccountAgain:function(account,oldAccount){
                    if (!account || !account.length) {
                        return 'ACCOUNT_NULL';
                    }
                    if(!this.checkBank(account)){
                        return 'ACCOUNT_ERROR';
                    }
                    if (account!=oldAccount) {
                        return 'ACCOUNT_OLD_ERROR';
                    }
                },
                checkMobile:function(mobile){
                    console.log('dsda')
                    if (!mobile || !mobile.length) {
                        return 'MOBILE_NULL';
                    }
                    if (!('' + mobile)
                            .match(/^[1][3|4|5|7|8][0-9]{9}$/)) {
                        return 'MOBILE_INVALID';
                    }
                    return false;
                },
                checkNewMobile:function(mobile){
                    if (!mobile || !mobile.length) {
                        return 'NEW_MOBILE_NULL';
                    }
                    if (!('' + mobile)
                            .match(/^[1][3|4|5|7|8][0-9]{9}$/)) {
                        return 'NEW_MOBILE_INVALID';
                    }
                    return false;
                },
                checkName:function(name){
                    if (!name || !name.length) {
                        return 'NAME_NULL';
                    }
                    if (name.length>8) {
                        return 'NAME_LONG';
                    }
                    return false;
                },
                checkGoodName:function(name){
                    if (!name || !name.length) {
                        return 'GOOD_NAME_NULL';
                    }
                    if (name.length>16) {
                        return 'GOOD_NAME_LONG';
                    }
                    return false;
                },
                checkUsername:function(name){
                    if (!name || !name.length) {
                        return 'USER_NAME_NULL';
                    }

                    return false;
                },
                checkChangePassword:function(password,oldpassowrd){
                    if (!password || !password.length) {
                        return 'PASSWORD_NULL';
                    }
                    if(password!=oldpassowrd){
                        return 'PASSWORD_ERROR';
                    }
                    return false;

                },
                checkPassword:function(password,passwordAgain){
                    if (!password || !password.length) {
                        return 'PASSWORD_NEW_NULL';
                    }
                    if(password.length<6){
                        return 'PASSWORD_NEW_SHORT';
                    }
                    if(password.length>10){
                        return 'PASSWORD_NEW_LONG';
                    }

                    if(!passwordAgain || !passwordAgain.length){
                        return 'PASSWORD_AGAIN_NULL';
                    }
                    if(password!=passwordAgain){
                        return 'PASSWORD_AGAIN_FAILURE';
                    }
                    return false;
                },
                checkNull:function(param,res){
                    if(!param){
                        return res;
                    }
                    if(param.length==0){
                        return res;
                    }
                    return false;
                },
                checkLength:function(param,minNumber,maxNumber,minres,maxres){
                    if(!param ||param.length<minNumber){
                        return minres;
                    }
                    if(param.length>maxNumber){
                        return maxres;
                    }
                    return false;
                },
                checkNumber:function(param,res){
                    console.log(param);
                    console.log(typeof param)
                    if(!param){
                        return res;
                    }
                    param=param.toString()
                    if(!param.match(/^[1-9][0-9]*$/)){
                        return res;
                    }
                    return false;
                },
                checkPrice:function(param,res){
                    console.log(isNaN(param));
                    if(!param || isNaN(param)){
                        return res;
                    }
                    return false;
                },

                checkBank:function(bankno){
                    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
                    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
                    var newArr=new Array();
                    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
                        newArr.push(first15Num.substr(i,1));
                    }
                    var arrJiShu=new Array();  //奇数位*2的积 <9
                    var arrJiShu2=new Array(); //奇数位*2的积 >9

                    var arrOuShu=new Array();  //偶数位数组
                    for(var j=0;j<newArr.length;j++){
                        if((j+1)%2==1){//奇数位
                            if(parseInt(newArr[j])*2<9)
                                arrJiShu.push(parseInt(newArr[j])*2);
                            else
                                arrJiShu2.push(parseInt(newArr[j])*2);
                        }
                        else //偶数位
                            arrOuShu.push(newArr[j]);
                    }

                    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
                    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
                    for(var h=0;h<arrJiShu2.length;h++){
                        jishu_child1.push(parseInt(arrJiShu2[h])%10);
                        jishu_child2.push(parseInt(arrJiShu2[h])/10);
                    }

                    var sumJiShu=0; //奇数位*2 < 9 的数组之和
                    var sumOuShu=0; //偶数位数组之和
                    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
                    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
                    var sumTotal=0;
                    for(var m=0;m<arrJiShu.length;m++){
                        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
                    }

                    for(var n=0;n<arrOuShu.length;n++){
                        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
                    }

                    for(var p=0;p<jishu_child1.length;p++){
                        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
                        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
                    }
                    //计算总和
                    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);

                    //计算Luhm值
                    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;
                    var luhm= 10-k;

                    if(lastNum==luhm){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            }
        });
        services.factory('errMap', function() {
            var map={
//HEAD
                REPERTORY_NULL:'仓库所在地不能为空',
                DISCOUNT_ERR:'折扣错误',
                ACTIVITY_NULL:'活动不能为空',
                DISCOUNT_INVALIDATE:'折扣率必须小于1',
//
                CITIES_NULL:'城市列表不能为空',
                TEMPLATE_NULL:'模板名不能为空',
                INIT_CASES_NULL:'默认件数不能为空',
                INIT_CASES_INVALID:'默认件数不合法',
                INIT_CHARGE_NULL:'默认运费不能为空',
                INIT_CHARGE_INVALID:'默认运费不合法',
                STEP_NULL:'增加的件数不能为空',
                STEP_INVALID:'增加的件数不合法',
                ADD_CHARGE_NULL:'增加的运费不能为空',
                ADD_CHARGE_INVALID:'增加的运费不合法',
                FIRST_CASES_NULL:'首件数不能为空',
                FIRST_CASES_INVALID:'首件数不合法',
                FIRST_CHARGE_NULL:'首件运费不能为空',
                FIRST_CHARGE_INVALID:'首件运费不合法',
                CONTINUE_CASES_NULL:'续件数不能为空',
                CONTINUE_CASES_INVALID:'续件数不合法',
                CONTINUE_CHARGE_NULL:'续件运费为空',
                CONTINUE_CHARGE_INVALID:'续件运费不合法',
                SHIPPING_TEMPLATE_NAME_NULL:'包邮模板名不能为空',
                SHIPPING_NULL:'包邮条件不能为空',
                SHIPPING_INVALID:'包邮条件不合法',
//yunfei
                EMAIL_INVALID:'邮箱不合法',
                EMAIL_NULL:'邮箱不能为空',
                MOBILE_NULL:'手机号码不能为空',
                MOBILE_INVALID:'手机号码有误',
                CHANGE_SUCCESS:'修改成功',
                CHANGE_FAILURE:'修改失败',
                ADD_SUCCESS:'添加成功',
                ADD_FAILURE:'添加失败',
                DEL_SUCCESS:'删除成功',
                DEL_FAILURE:'删除失败',
                UNIT_NULL:'请输入单位',
                ADMIN_CLOSE_SUCCESS:'关闭成功',
                ADMIN_CLOSE_FAILURE:'关闭失败',
                ADMIN_SEND_SUCCESS:'发货成功',
                ADMIN_SEND_FAILURE:'发货失败',
                PASSWORD_AGAIN_FAILURE:'两次输入密码不一致',
                USER_NAME_NULL:'请输入用户名',
                PASSWORD_NULL:'请输入密码',
                PASSWORD_AGAIN_NULL:'请再次输入密码',
                PASSWORD_ERROR:'输入密码有误',
                PASSWORD_NEW_NULL:'请输入新密码',
                NAME_PHONE_ERROR:'用户名与电话号码不匹配',
                NAME_PASSWD_ERROR:'用户名与密码不匹配',
                GET_CATEGORY_ERROR:'获取分类出错',
                GOOD_NAME_LONG:'商品名称不允许超过16个字符',
                GOOD_NAME_NULL:'商品名称不能为空',
                ICON_NULL:'请上传商品图标，建议尺寸为100*100',
                DETAIL_IMG_NULL:'请上传详情图片，建议尺寸640*320',
                DETAIL_IMG_MIN:'请上传至少2张详情图片',
                DETAIL_IMG_MAX:'详情图片页图片不允许超过9张',
                DETAIL_NULL:'商品描述不允许为空',
                STORE_NULL:'店铺描述不允许为空',
                STORE_DETAIL_NULL:'店铺故事不允许为空',
                PLACE_NULL:'商品产地不允许为空',
                PLACE_LONG:'商品产地不允许超过8个字符',
                NORM_NULL:'商品规格不允许为空',
                PRICE_NULL:'商品价格不允许为空',
                PRICE_ERROE:'商品价格有误',
                QUALITYHGINT:'库存必须大于入库初始值',
                QUANTITY_NULL:'商品数量不允许为空',
                QUANTITY_ERROR:'库存数量只允许为大于0的正整数',
                GET_GOOD_ERROR:'获取商品失败',
                PASSWORD_NEW_SHORT:'密码长度少于6位',
                PASSWORD_NEW_LONG:'密码长度超过10位',
                MOBILE_AGAIN_FAILURE:'手机号码不匹配',
                USER_AGAIN_FAILURE:'用户名不匹配',
                NEW_MOBILE_NULL:'请输入新手机号码',
                NEW_MOBILE_INVALID:'新手机号码格式有误',
                ACCOUNT_NULL:'请输入银行账号',
                ACCOUNT_NEW_NULL:'请输入新的银行账号',
                ACCOUNT_ERROR:'输入的银行账号有误',
                ACCOUNT_OLD_ERROR:'银行账号不匹配',
                ACCOUNT_NEW_ERROR:'新银行账号有误',
                FAILURE:'加载失败',
                INIT_QUANTITY_ERROR:'入库初始值只能为整数',
                FREQUENCY_ERROR:'发货频率只能为数字',
                SKU_NULL:'请添加商品规格',
                PRICE_LG_SALEPRICE:'现价必须小于原价',
                PRICE_INVALIDATE:'售价必须大于底价（进价或预售价）',
                GIFT_ERROR:'赠品数量不合法',
                LIMIT_NUMBER_ERROR:'限购数量不合法',
                PRE_SEND_TIME_NULL:'预售发货时间不能为空',
                PRE_TIME_INVALIDATE:'预售时间必须大于当前日期'
            };
            return {
                getMap:function(){
                    return map;
                }
            };
        })
    });
