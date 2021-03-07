"use strict";
exports.__esModule = true;
exports.Validator = void 0;
var validator_1 = require("validator");
var Validator = /** @class */ (function () {
    function Validator() {
    }
    Validator.prototype.isEmail = function (email) {
        return validator_1["default"].isEmail(email);
    };
    return Validator;
}());
exports.Validator = Validator;
