const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  addMoney,
  getGoalHistory,
  deleteMoneyHistory,
} = require("../controllers/goalControllers");


// Create Goal
router.post("/", verifyToken, createGoal);


// Get Goals
router.get("/", verifyToken, getGoals);


// Update Goal
router.put("/:id", verifyToken, updateGoal);


// Delete Goal
router.delete("/:id", verifyToken, deleteGoal);


// Add Money
router.patch(
  "/add-money/:id",
  verifyToken,
  addMoney
);


// Get Goal History
router.get(
  "/:id/history",
  verifyToken,
  getGoalHistory
);


// Delete Money History
router.delete(
  "/history/:id",
  verifyToken,
  deleteMoneyHistory
);


module.exports = router;