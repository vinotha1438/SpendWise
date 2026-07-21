const db = require("../config/db");

// Add Income
const addIncome = (req, res) => {
  const {
    title,
    amount,
    category,
    payment_method,
    income_date,
    notes,
  } = req.body;

  const user_id = req.user.id;

  const sql = `
    INSERT INTO income
    (user_id, title, amount, category, payment_method, income_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      title,
      amount,
      category,
      payment_method,
      income_date,
      notes,
    ],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to add income",
        });
      }

      res.status(201).json({
        message: "Income Added Successfully",
      });
    }
  );
};

// Get All Income
const getIncome = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT *
    FROM income
    WHERE user_id = ?
    ORDER BY income_date DESC
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch income",
      });
    }

    res.json(result);
  });
};

// Update Income
const updateIncome = (req, res) => {
  const { id } = req.params;

  const {
    title,
    amount,
    category,
    payment_method,
    income_date,
    notes,
  } = req.body;

  const user_id = req.user.id;

  const sql = `
    UPDATE income
    SET
      title = ?,
      amount = ?,
      category = ?,
      payment_method = ?,
      income_date = ?,
      notes = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [
      title,
      amount,
      category,
      payment_method,
      income_date,
      notes,
      id,
      user_id,
    ],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to update income",
        });
      }

      res.json({
        message: "Income Updated Successfully",
      });
    }
  );
};

// Delete Income
const deleteIncome = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const sql = `
    DELETE FROM income
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [id, user_id], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to delete income",
      });
    }

    res.json({
      message: "Income Deleted Successfully",
    });
  });
};

module.exports = {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
};