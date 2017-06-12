var TOKEN_EXPIRATION = 60;
var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;

exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC;

// token验证中间件
exports.verifyToken = function(req, res, next) {
    var token = getToken(req.headers);

};

exports.expireToken = function(headers) {
    var token = getToken(headers);

    if (token != null) {

    }
};

// 获取Header中的Token
var getToken = function(headers) {
    if (headers && headers.authorization) {
        var authorization = headers.authorization;
        var part = authorization.split(' ');

        if (part.length == 2) {
            var token = part[1];
            return token;
        } else {
            return null;
        }
    } else {
        return null;
    }
}
