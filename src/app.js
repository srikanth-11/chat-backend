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
var dotenv = require("dotenv");
var mongoose = require("mongoose");
var user_1 = require("./router/user/user");
var main_1 = require("./router/main/main");
var group_1 = require("./router/group/group");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var e = require("cors");
var chatmessages_1 = require("./models/chatmessages/chatmessages");
var groups_1 = require("./models/groups/groups");
var express = require("express");
// app config
var app = express();
dotenv.config();
var port = process.env.PORT || 5000;
var options = {
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: process.env.REQUEST_ORIGIN,
    preflightContinue: false
};
// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(e(options));
app.options("*", e(options));
app.use(bodyParser.json());
// router
app.use("/", main_1["default"]);
app.use("/user", user_1["default"]);
app.use("/groups", group_1["default"]);
// db config
var connectionUrl = process.env.MONGODB_CONNECTION_URL;
mongoose
    .connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function () { return console.log("Successfully connected to mongodb"); })["catch"](function (err) { return console.log("mongo error", err); });
// app listen
var server = app.listen(port, function () {
    return console.log("listening on port : " + port);
});
// registering a socket for server
var io = require("socket.io")(server, {
    cors: {
        origin: process.env.REQUEST_ORIGIN,
        methods: ["GET", "POST"]
    }
});
var users = [];
var groupUsers = [];
// socket connection
io.use(function (socket, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, process.env.ACCESS_TOKEN_SECRET_KEY, function (err, decoded) {
                if (err)
                    return next(new Error("Authentication error"));
                socket.decoded = decoded;
                next();
            });
        }
        else {
            next(new Error("Authentication error"));
        }
        return [2 /*return*/];
    });
}); }).on("connection", function (socket) {
    console.log("connect");
    socket.on("joinGroup", function (groupId) {
        socket.join(groupId);
        console.log("group");
        socket.to(groupId).on("chat-message", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
            var chatMessage, message, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!msg) return [3 /*break*/, 3];
                        chatMessage = new chatmessages_1.Message({
                            userId: socket.decoded.userid,
                            username: socket.decoded.username,
                            message: msg,
                            timeStamp: new Date()
                        });
                        return [4 /*yield*/, chatMessage.save()];
                    case 1:
                        message = _a.sent();
                        return [4 /*yield*/, groups_1.Group.updateOne({ _id: mongoose.Types.ObjectId(groupId) }, { $push: { messageIds: message._id } })];
                    case 2:
                        _a.sent();
                        data = {
                            _id: message._id,
                            message: msg,
                            username: socket.decoded.username,
                            timestamp: message.timestamp,
                            userId: message.userId
                        };
                        socket.broadcast.to(groupId).emit("chat-messages", data);
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 5];
                    case 5:
                        socket.on("disconnect", function () {
                            removeUserFromAllGroups();
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        if (groupId !== null) {
            var isGroupAvailable = groupUsers.some(function (group) { return group.groupId === groupId; });
            if (isGroupAvailable) {
                var groups = groupUsers.map(function (group) {
                    if (group.groupId === groupId) {
                        var isUserAlreadyJoined = group.users.some(function (user) { return user.id === socket.decoded.userid; });
                        !isUserAlreadyJoined &&
                            group.users.push({
                                id: socket.decoded.userid,
                                username: socket.decoded.username
                            });
                        return group;
                    }
                    else {
                        return group;
                    }
                });
                io.emit("room-users", groups);
            }
            else {
                users.push({
                    id: socket.decoded.userid,
                    username: socket.decoded.username
                });
                var data = {
                    groupId: groupId,
                    users: users
                };
                groupUsers.push(data);
                console.log("emitted");
                io.emit("room-users", groupUsers);
            }
        }
    });
    socket.on("leaveAllGroup", function () {
        removeUserFromAllGroups();
        io.emit("room-users", groupUsers);
    });
    socket.on("disconnect", function () {
        removeUserFromAllGroups();
        io.emit("room-users", groupUsers);
    });
    var removeUserFromAllGroups = function () {
        users = [];
        groupUsers = groupUsers.map(function (group) {
            var isUser = group.users.some(function (user) { return user.id === socket.decoded.userid; });
            isUser && socket.leave(group.groupId);
            group.users = group.users.filter(function (user) { return user.id !== socket.decoded.userid; });
            return group;
        });
    };
});
