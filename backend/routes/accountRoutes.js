const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  addAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
} = require("../controllers/accountController");


// ==========================================
// ADD ACCOUNT
// ==========================================
router.post(
  "/accounts",
  verifyToken,
  addAccount
);


// ==========================================
// GET ALL ACCOUNTS
// ==========================================
router.get(
  "/accounts",
  verifyToken,
  getAccounts
);


// ==========================================
// UPDATE ACCOUNT
// ==========================================
router.put(
  "/accounts/:id",
  verifyToken,
  updateAccount
);


// ==========================================
// DELETE ACCOUNT
// ==========================================
router.delete(
  "/accounts/:id",
  verifyToken,
  deleteAccount
);


module.exports = router;