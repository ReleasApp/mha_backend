const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

exports.register = async(req, res) => {
    try {
        const foundUser = await User.findOne({email: req.body.email});
        if(foundUser) return res.status(401).json({message: 'Email already registered, proceed to login'});
        const newUser = new User(req.body);
        const result = await cloudinary.uploader.upload(req.file.path, {quality: 60});
        // const result = await cloudinary.uploader.upload("data:image/jpg;base64," + req.body.profileImage, {quality: 60});
        newUser.hashPassword = await bcrypt.hashSync(req.body.password, 10);
        newUser.userImage = result.secure_url;
        newUser.userImageId = result.public_id;
        const savedUser = await newUser.save();
        savedUser.hashPassword = undefined;
        return res.status(201).json({message: 'You have been registered'}); 
    } catch (error) {
        res.status(400).json({message: error});
    }
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
                res.status(401).json({ message: 'Authentication failed. Wrong password or User Name'});
            } else {
                return res.json({
                    userId: user.id,
                    firstName: user.firstName,
                    role: user.role,
                    isApproved: user.isApproved,
                    imageUrl: user.userImage,
                    token: jwt.sign({ email: user.email, firstName: user.firstName, isApproved: user.isApproved, role: user.role, _id: user.id}, process.env.SECRET_KEY),
                });
            }
        }
    });
}

// Set image
exports.uploadImage = async (req, res) => {
    try {
        // find user in db with user id
        const userToUpdateImage = await User.findById({ _id: req.params.userId});
        // Return user image public id
        if((userToUpdateImage.hasOwnProperty('userImageId')) === true){
            if(
                userToUpdateImage.userImageId != "" || 
                userToUpdateImage.userImageId != null || 
                userToUpdateImage.userImageId != undefined
            ) {
                // Destroy exisiting image from cloudinary
                const public_id = userToUpdateImage.userImageId;
                cloudinary.uploader.destroy(public_id, (err, result)=>{
                    if(err) {
                        res.status(404).send('Failed to update image from cloudinary' + err.message);
                    }
                    if (result) {
                        // OnDestroy, upload new uploaded image
                        const userImageUpdate = cloudinary.uploader.upload("data:image/jpg;base64," + req.body.userImage, {quality: 60});
                        // Find document from db and update image url and image public id
                        User.findByIdAndUpdate(
                            { _id: req.params.userId}, 
                            {
                                userImage : userImageUpdate.secure_url, 
                                userImageId: userImageUpdate.public_id
                            }, 
                            { new: true }, (err, user) => {
                                // missing cloundinary update function
                                if (err) {
                                    res.status(404).send(err);
                                }
                                res.status(200).send("Updated successfully after deletion");
                                return;
                            })
                    }
                })

            } 
        }   else {
            // if false, just upload new image
            const userImageUpdate = await cloudinary.uploader.upload("data:image/jpg;base64," + req.body.image, {quality: 60});
            // const userImageUpdate = await cloudinary.uploader.upload(req.file.path, {quality: 60});
            // Find document from db and update image url and image public id
            await User.findByIdAndUpdate(
                { _id: req.params.userId}, 
                {
                    userImage : userImageUpdate.secure_url, 
                    userImageId: userImageUpdate.public_id
                }, 
                { new: true }, (err, user) => {
                    // missing cloundinary update function
                    if (err) {
                        res.status(404).send(err);
                    }
                    res.status(200).send("Updated successfully at one time");
                })
        }
    } catch(err){
        console.log(err)
    }
}

exports.findUsers = async (req, res) => {
    try {
        const users = await User.find({}, {hashPassword: 0})
        res.status(200).json(users);
    } catch(err){
        res.send(err.message);
    }
}

// Doctors to pending approval
exports.findAllDocsToApprove = async (req, res) => {
    try {
        const doctorsToApprove = await User.find(
            {
                role: 'Doctor', 
                isApproved: 'Usual'
            }, 
            {
                hashPassword: 0
            })
        res.status(200).json(doctorsToApprove);
    } catch(err){
        res.send(err.message);
    }
}

// Update doctor approved status
exports.approveDoctor = async (req, res) => {
    try {
        const currentDoctor = await User.findByIdAndUpdate(
            { _id: req.params.userId}, 
            {isApproved : req.body.isApproved}, 
            { new: true }
        )
        res.status(200).json(currentDoctor);
    } catch(err){
        res.send(err.message);
    }
}

// TO check if public id exisits  in cloudinary
// cloudinary.api.resource('kitten')
//   .then(result => console.log(result))
//   .catch(error => console.error(error));
// {role: 'Patient'}
