const express = require('express');
const { askQuestion, answerQuestion, getQuestionsByUser } = require('../Controllers/QuestionController');
const { protect }  = require("../Middleware/authMiddleware");
const router = express.Router();

// Question routes
router.post("/ask/:username", protect, askQuestion);
router.post("/answer/:questionId", protect, answerQuestion);

router.get("/:username", getQuestionsByUser);

module.exports = router;