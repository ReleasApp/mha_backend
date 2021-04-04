const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: 'First name is required'
    }, 
    lastName: {
        type: String,
        required: 'Last name is required'
    }, 
    email: {
        type: String,
        required: 'Email is required'
    },
    userImage: {
        type: String,
        default: ""
    },
    userImageId: {
        type: String,
        default: ""
    },
    hashPassword: {
        type: String,
        required: 'password is required'
    },
    role: {
        type: String,
        enum: ["Admin", "Patient", "Doctor"],
        default: "Patient"
    },
    isApproved: {
        type: String,
        enum: ["Usual", "Not-Approved", "Approved"],
        default: "Usual"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

const User = model('User', UserSchema);
module.exports = User;
