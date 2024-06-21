const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    displayName: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true 
    },
    password:{
        type: String,
    },
    phone: {
        type: String,
    },
    signinMethod: {
        type: String,
        required: true
    }, 
    photoURL:{
        type: String,
    }, 
    emailVerified:{
        type: Boolean
    },
    weight:{
        type: Array
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);