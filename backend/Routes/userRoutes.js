const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');

const {
    deleteUser,
    editUser,
    getAllUsers
} = require("../Controllers/UserContoller")

router.delete("/", protect, deleteUser);
router.patch("/:field", protect, editUser)
router.get("/all", getAllUsers);

module.exports = router;