const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  addMoney,
} = require("../controllers/goalControllers");

router.post("/", verifyToken, createGoal);

router.get("/", verifyToken, getGoals);

router.put("/:id", verifyToken, updateGoal);

router.delete("/:id", verifyToken, deleteGoal);

router.patch("/add-money/:id", verifyToken, addMoney);

module.exports = router;