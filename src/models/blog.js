const { model, Schema } = require('mongoose');

const BlogSchema = new Schema({
    title: {
        type: String,
        required: 'Title is required'
    }, 
    blogImage: {
        type: String,
        required: 'Image is required'
    },
    blogStatus: {
        type: String,
        enum: ["New", "Approved", "Declined"],
        default: "New"
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
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Blog = model('Blog', BlogSchema);
module.exports = Blog;

