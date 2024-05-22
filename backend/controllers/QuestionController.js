const Question = require('../Models/QuestionModel');
const User = require("../Models/UserModel");
const { questionLogger } = require("./logger");

const askQuestion = async function (req,res) {
    try {
        const author = req.user;
        
        const existingUser = await User.findOne({username: req.params.username});

        if (!existingUser){
            questionLogger.error("Status code: 404, Message: 'Error asking question: User not found'");
            return res.status(404).json({ message: 'User not found. Question not saved.' });
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
            return res.status(400).json({ message: 'Question has already been answered' });
        };

        await Question.findByIdAndUpdate(questionId, { answer: questionAnswer, answerDate: Date.now() })

        questionLogger.info(`Status code: 200, Message: 'Question answered successfully. Question ID: ${questionId}'`);
        res.status(200).json({ message: 'Question answered successfully'});

    } catch (error) {
        console.error('Error asking question:', error);
        questionLogger.error("Status code: 500, Message: 'Error answering question: Internal server error'");
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getQuestionsByUser = async function (req,res) {
    try {
        const existingUser = await User.findOne({ username: req.params.username }).populate('questionsRecieved').lean();

        if (!existingUser){
            questionLogger.error("Status code: 404, Message: 'Error getting questions: User not found'");
            return res.status(404).json({ message: 'User not found. Could not get questions.' });
        }

        const answeredQuestions = existingUser.questionsRecieved.filter(question => question.hasOwnProperty('answer'));

        questionLogger.info(`Status code: 200, Message: 'Questions fetched successfully', User: ${existingUser._id}`);
        res.status(200).json({ message: "Questions fetched successfully", questions: answeredQuestions });

    } catch (error) {
        console.error('Error fetching questions:', error);
        questionLogger.error("Status code: 500, Message: 'Error fetching questions: Internal server error'");
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getOwnQuestions = async function (req, res) {
    try {
        const user = await User.findOne({ username: req.user.username }).populate(['questionsRecieved', 'questionsAsked']);

        if (!user) {
            questionLogger.error("Status code: 404, Message: 'Error getting own questions: User not found'");
            return res.status(404).json({ message: 'User not found. Could not get own questions.' });
        }

        const questionsRecieved = user.questionsRecieved; 
        const questionsAsked = user.questionsAsked;

        questionLogger.info(`Status code: 200, Message: 'Own questions fetched successfully', User: ${user._id}`);
        res.status(200).json({ message: "Own questions fetched successfully", questionsRecieved, questionsAsked });
        
    } catch (error) {
        console.error('Error fetching questions:', error);
        questionLogger.error("Status code: 500, Message: 'Error fetching own questions: Internal server error'");
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getFeedQuestions = async function (req, res) {
    try {
        const user = req.user;
        const usersFollowed = user.following;

        // Check if the user is following anyone
        if (usersFollowed.length === 0) {
            questionLogger.info(`Status code: 200, Message: 'User is not following anyone.'`);
            return res.status(200).json({ message: 'You are not following anyone yet.', questions: [] });
        }

        // Fetch all questions answered by the users followed
        const questions = await Question.find({ recipient: { $in: usersFollowed } }).sort({ answerDate: -1 }).populate('recipient');

        // Check if there are no questions
        if (questions.length === 0) {
            questionLogger.info(`Status code: 200, Message: 'Users followed have no answered questions.'`);
            return res.status(200).json({ message: 'Users you are following have not answered any questions yet.', questions: [] });
        }

        questionLogger.info(`Status code: 200, Message: 'Fetched feed questions successfully'`);
        return res.status(200).json({ message: 'Successfully fetched feed questions', questions: questions });
    } catch (error) {
        questionLogger.error(`Status code: 500, Message: 'Error fetching feed questions: Internal server error'`);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    askQuestion,
    answerQuestion,
    getQuestionsByUser,
    getOwnQuestions,
    getFeedQuestions
};