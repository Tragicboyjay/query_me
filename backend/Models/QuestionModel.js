const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    recipient: {
        type: String, 
        required: true
    },
    answer: String,
    creationDate: {
        type: Date,
        default: Date.now
    },
    answerDate: {
        type: Date,
    }

});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;