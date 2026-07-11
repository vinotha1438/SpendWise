const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const incomeController = require("../controllers/incomeController");

// Add Income
router.post("/income", verifyToken, incomeController.addIncome);

// Get All Income
router.get("/income", verifyToken, incomeController.getIncome);

// Update Income
router.put("/income/:id", verifyToken, incomeController.updateIncome);

// Delete Income
router.delete("/income/:id", verifyToken, incomeController.deleteIncome);

module.exports = router;