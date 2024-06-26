const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');

const {
    deleteUser,
    editUser,
    getAllUsers,
    followUser,
    unfollowUser,
    getFollowerCount,
    getUserFollowInfo
} = require("../Controllers/UserContoller")

router.delete("/", protect, deleteUser);
router.patch("/:field", protect, editUser);
router.get("/all", getAllUsers);
router.patch("/follow/:username", protect, followUser);
router.patch("/unfollow/:username", protect, unfollowUser);
router.get("/follow-count/:username", getFollowerCount);
router.get("/follow-info", protect, getUserFollowInfo);


module.exports = router;