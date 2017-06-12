var utils = module.exports;

/**
 * clone an object
 */
utils.clone = function (origin) {
    if (!origin) {
        return;
    }

    var obj = {};
    for (var f in origin) {
        if (origin.hasOwnProperty(f)) {
            obj[f] = origin[f];
        }
    }
    return obj;
};

/**
 * 验证手机号码
 * @param string 手机号字符串
 * @returns {boolean}
 */
utils.isMobile = function (string) {
    if (!string) {
        return false;
    }
    var re = /^1\d{10}$/;
    if (re.test(string)) {
        return true;
    }
    return false;
}
/**
 * 验证邮箱
 * @param string
 * @returns {boolean}
 */
utils.isEmail = function (string) {
    if (!string) {
        return false
    }
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (re.test(string)) {
        return true;
    }
    return false;
}
/**
 * 验证电话号码
 * @param string
 * @returns {boolean}
 */
utils.isPhone = function (string) {
    if (!string) {
        return false;
    }
    var re = /^0\d{2,3}-?\d{7,8}$/;
    if (re.test(string)) {
        return true;
    }
    return false;
}