const express = require('express');
const router = express.Router();

const {
    createUser,
    authenticateUser
} 
= require("../Controllers/AuthController");

// Auth Routes
router.post("/create-user", createUser);

router.post("/authenticate", authenticateUser)

module.exports = router;