const { model , Schema } = require('mongoose');

const ChatSchema = new Schema({
    _id: String,
    text: String,
    createdAt: Date,
    user: {
        image: {
            type: String,
            required: true
        },
        senderId: {
            type: String,
            required: true
        },
        receiverId: {
            type: String,
            required: true
        }
    }
})

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;

