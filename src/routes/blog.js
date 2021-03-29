var router = require('express').Router();

const { addNewBlog, getBlogs, updateBlog, deleteBlog } = require('../controllers/blog');
const { login, register, loginRequired, uploadImage, findUsers } = require('../controllers/user');
const upload = require('../config/multer');
    
router.get('/blogs', getBlogs) 
router.post('/blogs', addNewBlog);
router.put('/blog/:blogId', updateBlog);
router.delete('/blog/:blogId', deleteBlog);
router.post('/auth/register', register);
router.post('/login', login);
// router.put('/user/:userId', upload.single('userImage'), uploadImage);
router.put('/user/:userId', uploadImage);
router.get('/users', findUsers);

module.exports = router;