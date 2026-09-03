const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  addTransfer,
  getTransfers,
  deleteTransfer,
} = require("../controllers/transferController");


// ==========================================
// ADD TRANSFER
// ==========================================
router.post(
  "/transfers",
  verifyToken,
  addTransfer
);


// ==========================================
// GET ALL TRANSFERS
// ==========================================
router.get(
  "/transfers",
  verifyToken,
  getTransfers
);


// ==========================================
// DELETE TRANSFER
// ==========================================
router.delete(
  "/transfers/:id",
  verifyToken,
  deleteTransfer
);


module.exports = router;
