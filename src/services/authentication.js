"use strict";
exports.__esModule = true;
exports.authenticate = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
// authenticate the user is logged in or not
function authenticate(req, res, next) {
    if (req.headers.authorization) {
        jsonwebtoken_1["default"].verify(req.headers.authorization, process.env.ACCESS_TOKEN_SECRET_KEY, function (err, data) {
            if (data) {
                if (data.userid) {
                    req.body.userid = data.userid;
                    req.body.email = data.email;
                    next();
                }
                else {
                    res.status(401).json({
                        message: "Not Authorized"
                    });
                }
            }
            else {
                res.status(400).json({
                    message: "Invalid Token"
                });
            }
        });
    }
    else {
        res.status(400).json({
            messsage: "No Token Present"
        });
    }
}
exports.authenticate = authenticate;
