const Question = require('../Models/QuestionModel');
const User = require("../Models/UserModel");
const { questionLogger } = require("./logger");

const askQuestion = async function (req,res) {
    try {
        const author = req.user;
        
        const existingUser = await User.findOne({username: req.params.username})

        if (!existingUser){
            questionLogger.error("Status code: 404, Message: 'Error asking question: User not found'");
            res.status(404).json({ message: 'User not found. Question not saved.' });
        }
        
        const { questionBody } = req.body;

        const newQuestion = new Question({
            body: questionBody,
            author: author.username,
            recipient: existingUser.username
        });

        const savedQuestion = await newQuestion.save();
        const savedQuestionId = savedQuestion._id;

        await User.findByIdAndUpdate(author._id, { $addToSet: { questionsAsked: savedQuestionId } });
        await User.findByIdAndUpdate(existingUser._id, { $addToSet: { questionsRecieved: savedQuestionId } }); 
        
        questionLogger.info(`Status code: 201, Message: 'Question saved successfully', Author: ${author._id}, Reciever: ${existingUser._id}`);
        res.status(201).json({ message: 'Question saved successfully' });

    } catch (error) {
        console.error('Error asking question:', error);
        questionLogger.error("Status code: 500, Message: 'Error saving question: Internal server error'");
        res.status(500).json({ message: 'Internal server error' });
    }    
};

const answerQuestion = async function (req,res) {
    try {
        const questionId = req.params.questionId;
        const reciever = await User.findById(req.user._id);
        const {questionAnswer} = req.body

        if (!reciever.questionsRecieved.includes(questionId)){
            questionLogger.error(`Status code: 403, Message: 'Unauthorized: You are not authorized to answer this question. Question ID: ${questionId}'`);
            res.status(403).json({ message: 'You are not authorized to answer this question.', questionId });
        };

        const question = await Question.findById(questionId);

        if (question.answer) {
            questionLogger.error(`Status code: 400, Message: 'Error answering question: Question has already been answered. Question ID: ${questionId}'`);
            res.status(400).json({ message: 'Question has already been answered' });
        };

        await Question.findByIdAndUpdate(questionId, { answer: questionAnswer })

        questionLogger.info(`Status code: 200, Message: 'Question answered successfully. Question ID: ${questionId}'`);
        res.status(200).json({ message: 'Question answered successfully'});
        
    } catch (error) {
        console.error('Error asking question:', error);
        questionLogger.error("Status code: 500, Message: 'Error answering question: Internal server error'");
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    askQuestion,
    answerQuestion
};