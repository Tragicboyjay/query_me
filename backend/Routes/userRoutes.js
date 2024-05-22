const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');

const {
    deleteUser,
    editUser,
    getAllUsers,
    followUser,
    unfollowUser
} = require("../Controllers/UserContoller")

router.delete("/", protect, deleteUser);
router.patch("/:field", protect, editUser);
router.get("/all", getAllUsers);
router.patch("/follow/:username", protect, followUser);
router.patch("/unfollow/:username", protect, unfollowUser);


module.exports = router;