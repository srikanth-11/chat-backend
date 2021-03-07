"use strict";
exports.__esModule = true;
exports.Group = void 0;
// importing
var mongoose = require("mongoose");
// Creating schema for groups
var groupSchema = new mongoose.Schema({
    // adding user ids present in the group
    userIds: [{
            userId: String,
            username: String
        }],
    // adding messages present in the group
    messageIds: [{
            type: String,
            "default": []
        }],
    groupName: String
});
// Creating a model/Collection for groups
var Group = mongoose.model('Group', groupSchema);
exports.Group = Group;
