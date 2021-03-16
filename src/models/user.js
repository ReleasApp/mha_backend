const { Schema } = require('mongoose');
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
        type: String
    },
    userImageId: {
        type: String
    },
    hashPassword: {
        type: String,
        required: 'password is required'
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};
