const multer = require('multer');

// Generate a random number to name
const name = ()=> Math.floor(Math.random()*10000); 

const storage = multer.diskStorage({
     filename: function(req, file, cb){
         cb(null, name() + file.originalname);
     }
 });

//  file types
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === '') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
     storage: storage,
     limits: {fileSize: 1024 * 1024 * 7},
     fileFilter: fileFilter
 });

 module.exports = upload;

 