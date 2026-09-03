const db = require("../config/db");
const { notifyUser } = require("../socket");

// Save Budget
const saveBudget = (req, res) => {
  const { category, monthly_budget, month, year } = req.body;

  const user_id = req.user.id;

  // Check if budget already exists
  const checkSql = `
    SELECT * FROM budgets
    WHERE user_id=? AND category=? AND month=? AND year=?
  `;

  db.query(
    checkSql,
    [user_id, category, month, year],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Database Error",
        });
      }

      if (rows.length > 0) {
        const updateSql = `
          UPDATE budgets
          SET monthly_budget=?
          WHERE id=?
        `;

        db.query(
          updateSql,
          [monthly_budget, rows[0].id],
          (err) => {
            if (err) {
              return res.status(500).json({
                message: "Update Failed",
              });
            }

            notifyUser(user_id);

            return res.json({
              message: "Budget Updated Successfully",
            });
          }
        );
      } else {
        const insertSql = `
          INSERT INTO budgets
          (user_id, category, monthly_budget, month, year)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            user_id,
            category,
            monthly_budget,
            month,
            year,
          ],
          (err) => {
            if (err) {
              return res.status(500).json({
                message: "Insert Failed",
              });
            }

            notifyUser(user_id);

            res.status(201).json({
              message: "Budget Saved Successfully",
            });
          }
        );
      }
    }
  );
};

// Get Budgets
const getBudgets = (req, res) => {
  const sql = `
    SELECT *
    FROM budgets
    WHERE user_id=?
    ORDER BY category ASC
  `;

  db.query(sql, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch budgets",
      });
    }

    res.json(rows);
  });
};


// Update Budget
const updateBudget = (req, res) => {
  const { monthly_budget } = req.body;

  const sql = `
    UPDATE budgets
    SET monthly_budget=?
    WHERE id=? AND user_id=?
  `;

  db.query(
    sql,
    [
      monthly_budget,
      req.params.id,
      req.user.id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Update Failed",
        });
      }

      notifyUser(req.user.id);

      res.json({
        message: "Budget Updated Successfully",
      });
    }
  );
};

// Delete Budget
const deleteBudget = (req, res) => {
  const sql = `
    DELETE FROM budgets
    WHERE id=? AND user_id=?
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
          message: "Delete Failed",
        });
      }

      notifyUser(req.user.id);

      res.json({
        message: "Budget Deleted Successfully",
      });
    }
  );
};

module.exports = {
  saveBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};