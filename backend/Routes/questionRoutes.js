const express = require('express');
const { askQuestion, answerQuestion, getQuestionsByUser, getOwnQuestions, getFeedQuestions, deleteQuestion } = require('../Controllers/QuestionController');
const { protect }  = require("../Middleware/authMiddleware");
const router = express.Router();

// Question routes
router.post("/ask/:username", protect, askQuestion);
router.post("/answer/:questionId", protect, answerQuestion);

router.get("/search/:username", getQuestionsByUser);
router.get("/own", protect, getOwnQuestions);

router.get("/feed-questions", protect, getFeedQuestions);

router.delete("/:id", protect, deleteQuestion);


module.exports = router;