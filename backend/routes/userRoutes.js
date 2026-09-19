const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    googleLogin,
    getProfile,
    updateProfile,
    changePassword,
} = require("../controllers/userControllers");

// Register API
router.post("/register", registerUser);

// Login API
router.post("/login", loginUser);

// Google Sign-In API
router.post("/google-login", googleLogin);

// Profile API
router.get("/profile", verifyToken, getProfile);

// Update Profile API
router.put("/profile", verifyToken, updateProfile);

// Change Password API
router.put("/profile/password", verifyToken, changePassword);

module.exports = router;