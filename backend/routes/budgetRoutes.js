const express = require("express");

const router = express.Router();

const {
  saveBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, saveBudget);

router.get("/", auth, getBudgets);

router.put("/:id", auth, updateBudget);

router.delete("/:id", auth, deleteBudget);

module.exports = router;