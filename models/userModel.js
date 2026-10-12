const mongoose = require('mongoose');
const userRoles = require('../utils/userRoles');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'], // [state, message]
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
        unique: true, // Ensure email is unique
    },
    password: {
        type: String,
        validate: {
            validator: function (value) {
                return value.length >= 6;
            },
            message: 'Password must be at least 6 characters long',
            required: [true, 'Password is required']
        },
    },
    role: {
        type: String,
        enum: Object.values(userRoles), // Restrict role to predefined values
        default: userRoles.USER
    },
    avatar: {
        type: String,
        default: '../uploads/profile.png'
    }
});

module.exports = mongoose.model('User', userSchema, 'users');