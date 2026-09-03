const express = require("express");

const router = express.Router();

const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
  clearNotifications,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

// Get All Notifications
router.get(
  "/",
  authMiddleware,
  getNotifications
);

// Create Notification
router.post(
  "/",
  authMiddleware,
  createNotification
);

// Mark Notification as Read
router.put(
  "/:id/read",
  authMiddleware,
  markAsRead
);

// Delete One Notification
router.delete(
  "/:id",
  authMiddleware,
  deleteNotification
);

// Clear All Notifications
router.delete(
  "/",
  authMiddleware,
  clearNotifications
);

module.exports = router;