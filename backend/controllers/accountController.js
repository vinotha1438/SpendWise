const db = require("../config/db");
const { notifyUser } = require("../socket");


// ==========================================
// ADD ACCOUNT
// ==========================================
const addAccount = (req, res) => {
  const {
    account_name,
    account_type,
    opening_balance,
  } = req.body;

  const user_id = req.user.id;

  if (!account_name) {
    return res.status(400).json({
      message: "Account name is required",
    });
  }

  const balance = Number(opening_balance || 0);

  const sql = `
    INSERT INTO accounts
    (
      user_id,
      account_name,
      account_type,
      opening_balance,
      current_balance
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      account_name,
      account_type || "Bank",
      balance,
      balance,
    ],
    (err, result) => {
      if (err) {
        console.log("ADD ACCOUNT ERROR:", err);

        return res.status(500).json({
          message: "Failed to add account",
          error: err.message,
        });
      }

      notifyUser(user_id);

      res.status(201).json({
        message: "Account Added Successfully",
        id: result.insertId,
      });
    }
  );
};


// ==========================================
// GET ALL ACCOUNTS
// ==========================================
const getAccounts = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT
      id,
      account_name,
      account_type,
      opening_balance,
      current_balance,
      created_at
    FROM accounts
    WHERE user_id = ?
    ORDER BY created_at ASC, id ASC
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.log("GET ACCOUNTS ERROR:", err);

      return res.status(500).json({
        message: "Failed to fetch accounts",
        error: err.message,
      });
    }

    res.status(200).json(result);
  });
};


// ==========================================
// UPDATE ACCOUNT
// ==========================================
const updateAccount = (req, res) => {
  const { id } = req.params;

  const {
    account_name,
    account_type,
    opening_balance,
  } = req.body;

  const user_id = req.user.id;

  const newOpeningBalance = Number(opening_balance || 0);

  // Confirm the account exists and belongs to this user first.
  const selectSql = `
    SELECT id
    FROM accounts
    WHERE id = ? AND user_id = ?
  `;

  db.query(selectSql, [id, user_id], (selectErr, rows) => {
    if (selectErr) {
      console.log("UPDATE ACCOUNT (lookup) ERROR:", selectErr);

      return res.status(500).json({
        message: "Failed to update account",
        error: selectErr.message,
      });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // current_balance is recalculated FROM SCRATCH here, from the
    // real transaction history — not derived from whatever the
    // stored current_balance happened to already be. This makes the
    // update self-healing: even if current_balance had previously
    // drifted out of sync (e.g. from testing under older code),
    // this always lands on the mathematically correct value:
    //   opening_balance + total income - total expenses
    const incomeSql = `
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM income
      WHERE account_id = ? AND user_id = ?
    `;

    const expenseSql = `
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM expenses
      WHERE account_id = ? AND user_id = ?
    `;

    db.query(incomeSql, [id, user_id], (incomeErr, incomeRows) => {
      if (incomeErr) {
        console.log("UPDATE ACCOUNT (income sum) ERROR:", incomeErr);

        return res.status(500).json({
          message: "Failed to update account",
          error: incomeErr.message,
        });
      }

      db.query(expenseSql, [id, user_id], (expenseErr, expenseRows) => {
        if (expenseErr) {
          console.log("UPDATE ACCOUNT (expense sum) ERROR:", expenseErr);

          return res.status(500).json({
            message: "Failed to update account",
            error: expenseErr.message,
          });
        }

        const totalIncome = Number(incomeRows[0]?.total || 0);
        const totalExpense = Number(expenseRows[0]?.total || 0);

        const newCurrentBalance =
          newOpeningBalance + totalIncome - totalExpense;

        const updateSql = `
          UPDATE accounts
          SET
            account_name = ?,
            account_type = ?,
            opening_balance = ?,
            current_balance = ?
          WHERE
            id = ?
            AND user_id = ?
        `;

        db.query(
          updateSql,
          [
            account_name,
            account_type,
            newOpeningBalance,
            newCurrentBalance,
            id,
            user_id,
          ],
          (updateErr, result) => {
            if (updateErr) {
              console.log("UPDATE ACCOUNT ERROR:", updateErr);

              return res.status(500).json({
                message: "Failed to update account",
                error: updateErr.message,
              });
            }

            if (result.affectedRows === 0) {
              return res.status(404).json({
                message: "Account not found",
              });
            }

            notifyUser(user_id);

            res.status(200).json({
              message: "Account Updated Successfully",
              current_balance: newCurrentBalance,
            });
          }
        );
      });
    });
  });
};


// ==========================================
// DELETE ACCOUNT
// ==========================================
const deleteAccount = (req, res) => {
  const { id } = req.params;

  const user_id = req.user.id;

  const sql = `
    DELETE FROM accounts
    WHERE
      id = ?
      AND user_id = ?
  `;

  db.query(
    sql,
    [id, user_id],
    (err, result) => {
      if (err) {
        console.log("DELETE ACCOUNT ERROR:", err);

        return res.status(500).json({
          message: "Failed to delete account",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Account not found",
        });
      }

      notifyUser(user_id);

      res.status(200).json({
        message: "Account Deleted Successfully",
      });
    }
  );
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
  addAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
};