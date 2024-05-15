const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');

const {
    deleteUser,
    editUser
} = require("../Controllers/UserContoller")

router.delete("/", protect, deleteUser);
router.patch("/:field", protect, editUser)

module.exports = router;