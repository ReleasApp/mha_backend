const Blog = require('../models/blog');
const cloudinary = require('../config/cloudinary');


// Create a blog
exports.addNewBlog = async (req, res) => {
    let newBlog = new Blog(req.body);
    const result = await cloudinary.uploader.upload("data:image/jpg;base64," + req.body.blogImage, {quality: 60});
    newBlog.author = req.user._id;
    newBlog.blogImage = result.secure_url;
    newBlog.blogImageId = result.public_id;
    await newBlog.save((err, blog) => {
        if (err) {
            console.log(err)
            res.status(404).send(err);
        }
        res.status(201).json({message: "Blog created and will be reviewed by a doctor soon"});
    });
};

// Return blogs to be approved by doctor
exports.getAllBlogsToApprove = (req, res) => {
    Blog.find({blogStatus: "New"}, (err, blogs) => {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).json(blogs);
    })
};

// Approve single user blog
exports.approveSingleUserBlog = (req, res) => {
    Blog.findOneAndUpdate({ _id: req.params.blogId}, {blogStatus: req.body.blogStatus}, { new: true }, (err, blog) => {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).json(blog);
    })
};

// Return all blogs
exports.getBlogs = (req, res) => {
    Blog.find({blogStatus: "Approved"}, (err, blogs) => {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).json(blogs);
    });
};

// update a blog
exports.updateBlog = (req, res) => {
    Blog.findOneAndUpdate({ _id: req.params.blogId}, req.body, { new: true }, (err, blog) => {
        // missing cloundinary update function
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).json(blog);
    })
}

// Delete a blog
exports.deleteBlog = async (req, res) => {
    await Blog.findById({_id: req.params.blogId}, (err, blog) => {
        if(err){
            res.status(404).send(err);
        } else {
            let public_id = blog.blogImageId;
            cloudinary.uploader.destroy(public_id, (err, result)=>{
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