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
var groups_1 = require("../../models/groups/groups");
var chatmessages_1 = require("../../models/chatmessages/chatmessages");
var mongoose = require("mongoose");
var authentication_1 = require("../../services/authentication");
var express = require("express");
// router config
var router = express.Router();
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var groups, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, groups_1.Group.find()];
            case 1:
                groups = _a.sent();
                if (groups.length > 0) {
                    res.json({
                        message: 'Entered group successfully',
                        groups: groups
                    });
                }
                else {
                    res.status(400).json({
                        message: 'invalid group'
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/group-messages/:groupId', authentication_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var group, messsageIds, messages, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, groups_1.Group.findOne({ _id: mongoose.Types.ObjectId(req.params.groupId) })];
            case 1:
                group = _a.sent();
                messsageIds = group.messageIds.map(function (messageId) { return mongoose.Types.ObjectId(messageId); });
                return [4 /*yield*/, chatmessages_1.Message.find({ _id: { $in: messsageIds } })];
            case 2:
                messages = _a.sent();
                // if message exists send response essage
                if (messages) {
                    res.json({
                        message: 'group messages fetched',
                        data: {
                            messages: messages
                        }
                    });
                }
                else {
                    res.status(400).json({
                        message: 'unable to fetch the group messages'
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                res.status(400).json({
                    message: 'unable to fetch the group messages'
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/group', authentication_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var group, createdGroup, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                group = new groups_1.Group({
                    groupName: req.body.groupName,
                    messageIds: []
                });
                return [4 /*yield*/, group.save()];
            case 1:
                createdGroup = _a.sent();
                res.json({
                    message: 'Group created Successfully',
                    data: {
                        group: createdGroup
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(400).json({
                    message: 'unable to create a group'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
