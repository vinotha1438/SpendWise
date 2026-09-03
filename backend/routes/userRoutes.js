const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    googleLogin,
    getProfile
} = require("../controllers/userControllers");

// Register API
router.post("/register", registerUser);

// Login API
router.post("/login", loginUser);

// Google Sign-In API
router.post("/google-login", googleLogin);

// Profile API
router.get("/profile", verifyToken, getProfile);

module.exports = router;
