const db = require("../config/db");

// Create Notification
const createNotification = (req, res) => {
  const { title, message, type } = req.body;

  const sql = `
    INSERT INTO notifications
    (user_id, title, message, type)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      req.user.id,
      title,
      message,
      type || "info",
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to create notification",
        });
      }

      res.status(201).json({
        message: "Notification created successfully",
        id: result.insertId,
      });
    }
  );
};

// Get Notifications
const getNotifications = (req, res) => {
  const sql = `
    SELECT *
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch notifications",
      });
    }

    res.json(rows);
  });
};

// Mark One Notification as Read
const markAsRead = (req, res) => {
  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [
      req.params.id,
      req.user.id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to update notification",
        });
      }

      res.json({
        message: "Notification marked as read",
      });
    }
  );
};

// Delete One Notification
const deleteNotification = (req, res) => {
  const sql = `
    DELETE FROM notifications
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [
      req.params.id,
      req.user.id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Delete failed",
        });
      }

      res.json({
        message: "Notification deleted successfully",
      });
    }
  );
};

// Clear All Notifications
const clearNotifications = (req, res) => {
  const sql = `
    DELETE FROM notifications
    WHERE user_id = ?
  `;

  db.query(sql, [req.user.id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to clear notifications",
      });
    }

    res.json({
      message: "All notifications cleared",
    });
  });
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
  clearNotifications,
};