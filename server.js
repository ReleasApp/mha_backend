const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes/blog');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err)=>{
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to mhadb successfully')
        app.listen(port, ()=> console.log(`Server listening on port ${port}`));
    }
})


// body parser set up
app.use(express.urlencoded({ extended: false,  limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// JWT setup
// app.use((req, res, next) => {
//     if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
//         jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY , (err, decode) => {
//             if (err) req.user = undefined;
//             req.user = decode;
//             next();
//         });
//     } else {
//         req.user = undefined;
//         next();
//     }
// });

routes(app);
