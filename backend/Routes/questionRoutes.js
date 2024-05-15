const express = require('express');
const { askQuestion, answerQuestion } = require('../Controllers/QuestionController');
const { protect }  = require("../Middleware/authMiddleware");
const router = express.Router();

router.post("/ask/:username", protect, askQuestion);
router.post("/answer/:questionId", protect, answerQuestion);

module.exports = router;