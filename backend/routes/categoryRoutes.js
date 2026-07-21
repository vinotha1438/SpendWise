const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const categoryController = require("../controllers/categoryController");

router.get(
  "/categories",
  verifyToken,
  categoryController.getCategories
);

router.post(
  "/categories",
  verifyToken,
  categoryController.addCategory
);

router.delete(
  "/categories/:id",
  verifyToken,
  categoryController.deleteCategory
);

module.exports = router;