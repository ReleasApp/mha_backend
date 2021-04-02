var router = require('express').Router();

const { addNewBlog, getBlogs, updateBlog, deleteBlog } = require('../controllers/blog');
const { login, register, loginRequired, uploadImage, findUsers } = require('../controllers/user');
const upload = require('../config/multer');
    
router.get('/blogs', loginRequired , getBlogs) 
router.post('/blogs', loginRequired , addNewBlog);
router.put('/blog/:blogId', loginRequired ,updateBlog);
router.delete('/blog/:blogId',loginRequired , deleteBlog);
router.post('/auth/register', register);
router.post('/login', login);
// router.put('/user/:userId', upload.single('userImage'), uploadImage);
router.put('/user/:userId',loginRequired ,uploadImage);
router.get('/users',loginRequired ,findUsers);

module.exports = router;