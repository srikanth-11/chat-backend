// importing
import * as mongoose from 'mongoose';

// Creating schema for groups
const groupSchema = new mongoose.Schema({

    // adding user ids present in the group
    userIds: [{
        userId: String,
        username: String
    }],

    // adding messages present in the group
    messageIds: [{
        type: String,
        default: []
    }],

    groupName: String,

});

// Creating an interface for Groups
interface IGroup extends mongoose.Document {
    userId: Array<object>;
    messageIds: Array<string>;
    groupName: string;
}

// Creating a model/Collection for groups
const Group = mongoose.model<IGroup>('Group', groupSchema);

// exporting
export { Group, IGroup };