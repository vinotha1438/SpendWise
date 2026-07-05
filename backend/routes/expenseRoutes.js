const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
} = require("../controllers/expenseControllers");

// Protected Routes
router.post("/expenses", verifyToken, addExpense);

router.get("/expenses", verifyToken, getExpenses);

router.put("/expenses/:id", verifyToken, updateExpense);

router.delete("/expenses/:id", verifyToken, deleteExpense);

module.exports = router;
