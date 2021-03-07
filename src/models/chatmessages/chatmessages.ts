// importing
import * as mongoose from 'mongoose';

// Creating schema for whats app messages
const messageSchema = new mongoose.Schema({

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
        default: new Date()
    },

    // to identify to which user the message was sent
    toUserId: String,

    // to identify if the message was sent in a group and which group
    groupId: String
})

interface ChatMessage extends mongoose.Document {
    userId: string;
    username: string;
    message: string;
    timestamp: Date;
    toUserId: String;
    groupId: String;
}


//Creating model/ Collection for messages schema
const Message = mongoose.model<ChatMessage>('Message', messageSchema);

// exporting model
export { Message, ChatMessage }