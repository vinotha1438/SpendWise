const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const budgetController = require("../controllers/budgetController");

// Save / Update Budget
router.post(
  "/budgets",
  verifyToken,
  budgetController.saveBudget
);

// Get All Budgets
router.get(
  "/budgets",
  verifyToken,
  budgetController.getBudgets
);

module.exports = router;