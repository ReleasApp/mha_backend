const { Schema } = require('mongoose');

const BlogSchema = new Schema({
    title: {
        type: String,
        required: 'Title is required'
    }, 
    blogImage: {
        type: String,
        required: 'Image is required'
    },
    blogImageId: {
        type: String,
        required: 'Image is required'
    },
    description: {
        type: String,
        required: 'Description is required'
    },
    author: {
        type: Schema.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


BlogSchema.path('title').set(function (v) {
    return capitalize(v).trim();
});
