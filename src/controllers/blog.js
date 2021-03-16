import mongoose from 'mongoose';
import { BlogSchema } from '../models/blog';
const cloudinary = require('../config/cloudinary');

var Blog = mongoose.model('Blog', BlogSchema);

// Create a blog
export const addNewBlog = (req, res) => {
    let newBlog = new Blog(req.body);
    // missing implement cloundinary and multer for image upload
    newBlog.save((err, blog) => {
        if (err) {
            res.status(404).send(err);
        }
        res.status(201).json(blog);
    });
};

// Return all blogs
export const getBlogs = (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).json(blogs);
    });
};

// update a blog
export const updateBlog = (req, res) => {
    Blog.findOneAndUpdate({ _id: req.params.blogId}, req.body, { new: true }, (err, blog) => {
        // missing cloundinary update function
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).json(blog);
    })
}

// Delete a blog
export const deleteBlog = (req, res) => {
    Blog.findById(req.params.blogId, (err, blog) => {
        if(err){
            res.status(404).send(err);
        } else {
            cloundinary.destroy({where: {public_id: blog.blogImageId}}, (err, result)=>{
                if(err) {
                    res.status(404).send('Failed to delete image from cloudinary');
                }
                Blog.remove({ _id: blog.id }, (err, blog) => {
                    if (err) {
                        res.status(404).send(err);
                    }
                    res.status(200).json({ message: 'Successfully deleted blog post'});
                })
            })
        }
    })
}