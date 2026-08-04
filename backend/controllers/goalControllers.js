const db = require("../config/db");

// Create Goal
const createGoal = (req, res) => {
  const { goal_name, target_amount, target_date } = req.body;

  const sql = `
    INSERT INTO goals
    (user_id, goal_name, target_amount, target_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [req.user.id, goal_name, target_amount, target_date],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Failed to create goal",
        });
      }

      res.status(201).json({
        message: "Goal Created Successfully",
      });
    }
  );
};

// Get Goals
const getGoals = (req, res) => {
  const sql = `
    SELECT *
    FROM goals
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [req.user.id], (err, rows) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database Error",
      });
    }

    res.json(rows);
  });
};

// Update Goal
const updateGoal = (req, res) => {
  const { goal_name, target_amount, target_date } = req.body;

  const sql = `
    UPDATE goals
    SET
      goal_name = ?,
      target_amount = ?,
      target_date = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [
      goal_name,
      target_amount,
      target_date,
      req.params.id,
      req.user.id,
    ],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Update Failed",
        });
      }

      res.json({
        message: "Goal Updated Successfully",
      });
    }
  );
};

// Delete Goal
const deleteGoal = (req, res) => {
  const sql = `
    DELETE FROM goals
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [req.params.id, req.user.id], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Delete Failed",
      });
    }

    res.json({
      message: "Goal Deleted Successfully",
    });
  });
};

// Add Money
const addMoney = (req, res) => {
  const { amount } = req.body;

  const sql = `
    UPDATE goals
    SET saved_amount = saved_amount + ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [
      amount,
      req.params.id,
      req.user.id,
    ],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to add money",
        });
      }

      res.json({
        message: "Money Added Successfully",
      });
    }
  );
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  addMoney,
};