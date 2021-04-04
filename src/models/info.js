const { model, Schema } = require('mongoose');

const InfoSchema = new Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    category: {
        type: String,
        required: 'Category is required'
    },
    link: {
        type: String,
        required: 'Link is required'
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Info = model('Info', InfoSchema);
module.exports = Info;

