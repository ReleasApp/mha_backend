const { model , Schema } = require('mongoose');

const ChatUserSchema = new Schema({
    avatar: {
        type: String
    },
    _id: {
        type: String,
        required: true
    },
    name: String
    ,
    receiverId: {
        type: String,
        required: true
    }
})

const ChatSchema = new Schema({
    _id: String,
    text: String,
    createdAt: Date,
    user: {
       type: ChatUserSchema,
       required: true
    }
})

const Chat = model('Chat', ChatSchema);
module.exports = Chat;

