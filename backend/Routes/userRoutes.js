const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');

const {
    deleteUser
} = require("../Controllers/UserContoller")

router.delete("/:id", protect, deleteUser);

module.exports = router;