var router = require('express').Router();

const { addNewBlog, getBlogs, updateBlog, deleteBlog, getAllBlogsToApprove, approveSingleUserBlog } = require('../controllers/blog');
const { login, register, uploadImage, findUsers, findAllDocsToApprove, approveDoctor } = require('../controllers/user');
// const { addNewInfo, getInfos, deleteInfo } = require('../controllers/info');
const { addNewDocInfo, getDocInfos, deleteDocInfo } = require('../controllers/docInfo');
const {  loginRequired, checkDocValidate, checkAdmin } = require('../config/Authorization');
const upload = require('../config/multer');

// Blog section
router.get('/blogs', loginRequired , getBlogs);
router.get('/blogs/to-approve', loginRequired , checkDocValidate, getAllBlogsToApprove);
router.put('/blogs/to-approve/:blogId', loginRequired, checkDocValidate, approveSingleUserBlog);
router.post('/blogs', loginRequired , addNewBlog);
router.put('/blog/:blogId', loginRequired ,updateBlog);
router.delete('/blog/:blogId',loginRequired , deleteBlog);

// Info section changec to Doc info section
router.post('/infos', loginRequired, checkDocValidate, upload.single('docInfoImage'), addNewDocInfo);
router.get('/infos/:category', loginRequired, getDocInfos);
router.delete('/info/:infoId', loginRequired, checkDocValidate, deleteDocInfo);

// User section
// router.post('/auth/register', upload.single("profileImage"), register);
router.post('/auth/register', register);
router.post('/login', login);
// router.put('/user/:userId', upload.single('userImage'), uploadImage);
router.put('/user/:userId',loginRequired ,uploadImage);
router.get('/users',loginRequired ,findUsers);

// Admin section
router.get('/doctors/approve', loginRequired, checkAdmin, findAllDocsToApprove);
router.put('/doctors/status/:userId', loginRequired, checkAdmin, approveDoctor);

module.exports = router;