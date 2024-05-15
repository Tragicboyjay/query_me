const express = require('express');
const { askQuestion } = require('../Controllers/QuestionController');
const { protect }  = require("../Middleware/authMiddleware");
const router = express.Router();

router.post("/ask/:username", protect, askQuestion);

module.exports = router;