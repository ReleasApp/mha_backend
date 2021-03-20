const { model } = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

exports.loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!'});
    }
}

exports.register = (req, res) => {
    const newUser = new User(req.body);
    newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
    newUser.save((err, user) => {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            user.hashPassword = undefined;
            return res.json(user); 
        }
    })
}

exports.login = (req,res) => {
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(401).json({ message: 'Authentication failed. No user found'});
        } else if (user) {
            if (!user.comparePassword(req.body.password, user.hashPassword)) {
                res.status(401).json({ message: 'Authentication failed. Wrong password'});
            } else {
                return res.json({token: jwt.sign({ email: user.email, firstName: user.firstName, _id: user.id}, process.env.SECRET_KEY)});
            }
        }
    });
}

// Set image
exports.uploadImage = (req, res) => {
    cloudinary.uploader.upload(req.file.path, {}, (err, result)=>{
        if(err) {
            console.log(err)
        } else {
            User.findById({ _id: req.params.blogId}, )
            // newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
        }
    })
}
