const { 
    addNewBlog, 
    getBlogs, 
    updateBlog,
    deleteBlog 
} = require('../controllers/blog');
// const { login, register, loginRequired, uploadImage } = require('../controllers/user');
const upload = require('../config/multer');

const routes = (app) => {
    app.route('/blogs')
    // get all blogs
    .get((req, res, next) => {
        next();
    }, 
    // loginRequired, 
    getBlogs)
    
    // POST endpoint
    .post(
        // loginRequired, 
        // upload.single('blogImage'), 
        addNewBlog);

    app.route('/blog/:blogId') 
    // put request
    .put(
        // loginRequired, 
        updateBlog)

    // delete request
    .delete(
        // loginRequired, 
        deleteBlog);

    // registration route
    // app.route('/auth/register')
    //     .post(register);

    // login route
    // app.route('/login')
    //     .post(login);

    // upload image
    // app.route('/user/:userId')
    // // put request
    // .put(loginRequired, upload.single('image'), uploadImage)

}

module.exports = routes;