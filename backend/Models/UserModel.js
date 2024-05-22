const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    followers: [{
        type: String, 
        unique: true 
    }],
    following: [{
        type: String, 
        unique: true 
    }],
    questionsAsked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    questionsRecieved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
