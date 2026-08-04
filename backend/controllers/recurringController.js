const db = require("../config/db");

// Get All Recurring Expenses
const getRecurringExpenses = (req, res) => {
  const sql = `
    SELECT *
    FROM recurring_expenses
    WHERE user_id = ?
    ORDER BY next_due_date ASC
  `;

  db.query(sql, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch recurring expenses",
      });
    }

    res.json(rows);
  });
};

// Add Recurring Expense
const addRecurringExpense = (req, res) => {
  const {
    title,
    category,
    amount,
    payment_method,
    frequency,
    next_due_date,
    notes,
  } = req.body;

  const sql = `
    INSERT INTO recurring_expenses
    (
      user_id,
      title,
      category,
      amount,
      payment_method,
      frequency,
      next_due_date,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      req.user.id,
      title,
      category,
      amount,
      payment_method,
      frequency,
      next_due_date,
      notes,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to add recurring expense",
        });
      }

      res.status(201).json({
        message: "Recurring expense added successfully",
      });
    }
  );
};

// Update Recurring Expense
const updateRecurringExpense = (req, res) => {
  const { id } = req.params;

  const {
    title,
    category,
    amount,
    payment_method,
    frequency,
    next_due_date,
    notes,
  } = req.body;

  const sql = `
    UPDATE recurring_expenses
    SET
      title=?,
      category=?,
      amount=?,
      payment_method=?,
      frequency=?,
      next_due_date=?,
      notes=?
    WHERE id=? AND user_id=?
  `;

  db.query(
    sql,
    [
      title,
      category,
      amount,
      payment_method,
      frequency,
      next_due_date,
      notes,
      id,
      req.user.id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Update failed",
        });
      }

      res.json({
        message: "Recurring expense updated successfully",
      });
    }
  );
};

// Delete Recurring Expense
const deleteRecurringExpense = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM recurring_expenses
    WHERE id=? AND user_id=?
  `;

  db.query(sql, [id, req.user.id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Delete failed",
      });
    }

    res.json({
      message: "Recurring expense deleted successfully",
    });
  });
};

module.exports = {
  getRecurringExpenses,
  addRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
};