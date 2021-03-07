"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var users_1 = require("../../models/users/users");
var bycrypt = require("bcrypt");
var validator_1 = require("../../services/validator");
var jsonwebtoken_1 = require("jsonwebtoken");
var mail_1 = require("../../services/mail");
var crypto = require("crypto");
var authentication_1 = require("../../services/authentication");
var express = require("express");
// router config
var router = express.Router();
// creating instance of validator service
var validator = new validator_1.Validator();
// handle user login 
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, isUserAuthenticated, token, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, users_1.User.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, bycrypt.compare(req.body.password, user.password)];
            case 2:
                isUserAuthenticated = _a.sent();
                // if user authenticated create jwt token and sent to user.
                if (isUserAuthenticated && user.isActive) {
                    token = jsonwebtoken_1["default"].sign({ userid: user._id, email: user.email, username: user.username }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
                    res.json({
                        message: 'User logged In',
                        token: token,
                        status: 'Successfully logged in',
                        user: {
                            email: user.email,
                            userId: user._id
                        }
                    });
                }
                else if (!user.isActive) {
                    res.status(401).json({
                        status: 'Failed to login',
                        message: 'Account is not activated'
                    });
                }
                else {
                    res.status(401).json({
                        status: 'Failed to login',
                        message: 'Provided credentials are wrong please verify'
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(401).json({
                    message: 'user not found'
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// handle user register
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, salt, hashPassword, activationCode, newUser, result, mailService, mailSubject, mailBody, mailTo, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                return [4 /*yield*/, users_1.User.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 2];
                res.status(400).json({
                    message: "Email already registered"
                });
                return [3 /*break*/, 8];
            case 2:
                if (!!validator.isEmail(req.body.email)) return [3 /*break*/, 3];
                res.status(400).json({
                    message: 'Invalid  Email, please enter a valid email'
                });
                return [3 /*break*/, 8];
            case 3: return [4 /*yield*/, bycrypt.genSalt(10)];
            case 4:
                salt = _a.sent();
                return [4 /*yield*/, bycrypt.hash(req.body.password, salt)];
            case 5:
                hashPassword = _a.sent();
                return [4 /*yield*/, crypto.randomBytes(32).toString('hex')];
            case 6:
                activationCode = _a.sent();
                newUser = new users_1.User({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashPassword,
                    accountActivationCode: activationCode,
                    accountActivationCodeExpiry: Date.now() + 300000
                });
                return [4 /*yield*/, newUser.save()];
            case 7:
                result = _a.sent();
                mailService = new mail_1.MailService();
                mailSubject = 'Account Activation for whats-app-clone';
                mailBody = "<div>\n                                <h4>\n                                 To activate the account please \n                                     <a href=\"" + process.env.REQUEST_ORIGIN + "/activate-account/" + activationCode + "\">click here</a>\n                                </h4>\n                             </div>";
                mailTo = req.body.email;
                // send mail for account activation
                mailService.sendMail(mailSubject, mailBody, mailTo);
                // send response message 
                res.json({
                    message: "Mail has been sent to   " + mailTo + "  for account activation",
                    data: result
                });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                err_2 = _a.sent();
                console.log(err_2);
                res.status(400).json({
                    message: "Unable to register user"
                });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// verfiy account activation code and acivate the account and send jwt token
router.post('/activate-account/:activationCode', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                console.log(req.params.activationCode);
                return [4 /*yield*/, users_1.User.findOne({ $and: [{ accountActivationCode: req.params.activationCode }, { accountActivationCodeExpiry: { $gt: Date.now() } }] })];
            case 1:
                user = _a.sent();
                console.log(user);
                if (!user) return [3 /*break*/, 3];
                user.isActive = true;
                user.accountActivationCode = '';
                user.accountActivationCodeExpiry = Date.now();
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                token = jsonwebtoken_1["default"].sign({ userid: user._id, email: user.email, username: user.username }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
                res.json({
                    message: 'Account activated successfully',
                    token: token
                });
                return [3 /*break*/, 4];
            case 3:
                // redirect to the ui with error message
                res.json({
                    message: 'Account activation failed, token expired'
                });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/ping', authentication_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, users_1.User.findOne({ _id: req.body.userid })];
            case 1:
                user = _a.sent();
                if (user && user.isActive) {
                    res.json({
                        message: "user is logged in",
                        data: {
                            email: req.body.email,
                            userid: req.body.userid
                        }
                    });
                }
                else {
                    res.status(400).json({
                        message: "User Does not exists"
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.log(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/forgot-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, resetToken, mailService, mailSubject, mailBody, mailTo, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                console.log(req.body.email);
                return [4 /*yield*/, users_1.User.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, crypto.randomBytes(32).toString('hex')];
            case 2:
                resetToken = _a.sent();
                user.resetPasswordToken = resetToken;
                user.resetPasswordTokenExpiry = Date.now() + 30000;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                console.log('resetToken', resetToken);
                mailService = new mail_1.MailService();
                mailSubject = 'Reset Password for whats-app-clone';
                mailBody = "<div>\n                <h3>Reset Password</h3>\n                <p>Please click the given link to reset your password <a target=\"_blank\" href=\"" + process.env.REQUEST_ORIGIN + "/reset-password/" + encodeURI(resetToken) + "\"> click here </a></p>\n            </div>";
                mailTo = user.email;
                // send mail for account activation
                mailService.sendMail(mailSubject, mailBody, mailTo);
                //send response message for uesr
                res.json({
                    message: "Mail has been sent to " + user.email + "</h4> with further instructions"
                });
                return [3 /*break*/, 5];
            case 4:
                res.status(400).json({
                    message: 'User not found'
                });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_5 = _a.sent();
                console.log(err_5);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/reset-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var password, confirmPassword, token, user, salt, hashPassword, mailService, mailSubject, mailBody, mailTo, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                password = req.body.password;
                confirmPassword = req.body.confirmPassword;
                token = req.body.token;
                return [4 /*yield*/, users_1.User.findOne({ resetPasswordToken: decodeURI(token), resetPasswordTokenExpiry: { $gt: Date.now() } })];
            case 1:
                user = _a.sent();
                if (!(user && password === confirmPassword)) return [3 /*break*/, 5];
                return [4 /*yield*/, bycrypt.genSalt(10)];
            case 2:
                salt = _a.sent();
                return [4 /*yield*/, bycrypt.hash(password, salt)];
            case 3:
                hashPassword = _a.sent();
                // Updating user password
                user.password = hashPassword;
                user.resetPasswordToken = '';
                user.resetPasswordTokenExpiry = Date.now();
                return [4 /*yield*/, user.save()];
            case 4:
                _a.sent();
                mailService = new mail_1.MailService();
                mailSubject = 'Successfully Reset Password for whats-app-clone';
                mailBody = "<div>\n                 <h3>Your password was reset successfully </h3>\n             </div>";
                mailTo = user.email;
                // send mail for account activation
                mailService.sendMail(mailSubject, mailBody, mailTo);
                res.json({
                    message: "Password reset successfull check your mail for confirmation",
                    token: token,
                    data: {
                        email: user.email
                    }
                });
                return [3 /*break*/, 6];
            case 5:
                res.status(400).json({
                    message: "Failed to update password token invalid"
                });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                err_6 = _a.sent();
                console.log(err_6);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
