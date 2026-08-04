const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getRecurringExpenses,
  addRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
} = require("../controllers/recurringController");

// Get All Recurring Expenses
router.get(
  "/recurring-expenses",
  verifyToken,
  getRecurringExpenses
);

// Add Recurring Expense
router.post(
  "/recurring-expenses",
  verifyToken,
  addRecurringExpense
);

// Update Recurring Expense
router.put(
  "/recurring-expenses/:id",
  verifyToken,
  updateRecurringExpense
);

// Delete Recurring Expense
router.delete(
  "/recurring-expenses/:id",
  verifyToken,
  deleteRecurringExpense
);

module.exports = router;