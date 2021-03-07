"use strict";
exports.__esModule = true;
exports.Message = void 0;
// importing
var mongoose = require("mongoose");
// Creating schema for whats app messages
var messageSchema = new mongoose.Schema({
    // userId to identify which user has sent the message
    userId: {
        type: String,
        required: true
    },
    // username to identify which user has sent the message
    username: {
        type: String,
        required: true
    },
    // message id to identify which message is sent
    message: {
        type: String,
        required: true
    },
    // timestamp to identify at what time message was sent
    timestamp: {
        type: Date,
        "default": new Date()
    },
    // to identify to which user the message was sent
    toUserId: String,
    // to identify if the message was sent in a group and which group
    groupId: String
});
//Creating model/ Collection for messages schema
var Message = mongoose.model('Message', messageSchema);
exports.Message = Message;
