const { model, Schema } = require('mongoose');

const DocInfoSchema = new Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    category: {
        type: String,
        required: 'Category is required'
    },
    infoImage: {
        type: String,
        required: 'Image is required'
    },
    infoImageId: {
        type: String,
        required: 'Image is required'
    },
    description: {
        type: String,
        required: 'Description is required'
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

const docInfo = model('docinfo', DocInfoSchema);
module.exports = docInfo;


