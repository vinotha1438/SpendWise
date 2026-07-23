const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/userControllers");

// Register API
router.post("/register", registerUser);

// Login API
router.post("/login", loginUser);

// Profile API
router.get("/profile", verifyToken, getProfile);

module.exports = router;