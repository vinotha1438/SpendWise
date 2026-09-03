const db = require("../config/db");
const { notifyUser } = require("../socket");

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


// Delete Goal — restores any real account money that was deducted
// via this goal's history entries before removing the goal, so
// deleting a goal never silently makes money disappear.
const deleteGoal = (req, res) => {
  const goalId = req.params.id;
  const userId = req.user.id;

  // Sum up how much needs to go back to each account, grouped so
  // an account with several Add Money entries only needs one
  // UPDATE instead of one per history row.
  const sumByAccountSql = `
    SELECT account_id, SUM(amount) AS total
    FROM goal_history
    WHERE
      goal_id = ?
      AND user_id = ?
      AND account_id IS NOT NULL
    GROUP BY account_id
  `;

  db.query(
    sumByAccountSql,
    [goalId, userId],
    (sumErr, accountTotals) => {
      if (sumErr) {
        console.log(sumErr);

        return res.status(500).json({
          message: "Delete Failed",
        });
      }

      const finishDeleteGoal = () => {
        // Remove history rows first (in case there's no ON DELETE
        // CASCADE set up on the foreign key), then the goal itself.
        const deleteHistorySql = `
          DELETE FROM goal_history
          WHERE goal_id = ? AND user_id = ?
        `;

        db.query(
          deleteHistorySql,
          [goalId, userId],
          (deleteHistoryErr) => {
            if (deleteHistoryErr) {
              console.log(deleteHistoryErr);

              return res.status(500).json({
                message: "Delete Failed",
              });
            }

            const deleteGoalSql = `
              DELETE FROM goals
              WHERE id = ? AND user_id = ?
            `;

            db.query(
              deleteGoalSql,
              [goalId, userId],
              (deleteGoalErr) => {
                if (deleteGoalErr) {
                  console.log(deleteGoalErr);

                  return res.status(500).json({
                    message: "Delete Failed",
                  });
                }

                notifyUser(userId);

                res.json({
                  message: "Goal Deleted Successfully",
                });
              }
            );
          }
        );
      };

      // Restore each affected account's balance one at a time,
      // then proceed to actually deleting the goal/history.
      const restoreNext = (index) => {
        if (index >= accountTotals.length) {
          return finishDeleteGoal();
        }

        const { account_id, total } = accountTotals[index];

        const restoreSql = `
          UPDATE accounts
          SET current_balance = current_balance + ?
          WHERE id = ? AND user_id = ?
        `;

        db.query(
          restoreSql,
          [Number(total), account_id, userId],
          (restoreErr) => {
            if (restoreErr) {
              console.log(restoreErr);

              return res.status(500).json({
                message: "Delete Failed",
              });
            }

            restoreNext(index + 1);
          }
        );
      };

      restoreNext(0);
    }
  );
};


// Add Money — deducts the amount from a selected account (same
// pattern as recording an expense) and credits it to the goal.
const addMoney = (req, res) => {
  const { amount, account_id } = req.body;

  const goalId = req.params.id;
  const userId = req.user.id;

  const numericAmount = Number(amount);

  if (!numericAmount || numericAmount <= 0) {
    return res.status(400).json({
      message: "Enter a valid amount",
    });
  }

  if (!account_id) {
    return res.status(400).json({
      message: "Please select an account",
    });
  }

  // Verify the account exists and belongs to this user before
  // touching its balance — same ownership check used for expenses.
  const accountCheckSql = `
    SELECT id
    FROM accounts
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    accountCheckSql,
    [account_id, userId],
    (accountErr, accountRows) => {
      if (accountErr) {
        console.log(accountErr);

        return res.status(500).json({
          message: "Failed to verify account",
        });
      }

      if (!accountRows || accountRows.length === 0) {
        return res.status(404).json({
          message: "Selected account not found",
        });
      }

      // Deduct from the account — mirrors how an expense deducts
      // from current_balance.
      const deductSql = `
        UPDATE accounts
        SET current_balance = current_balance - ?
        WHERE id = ? AND user_id = ?
      `;

      db.query(
        deductSql,
        [numericAmount, account_id, userId],
        (deductErr) => {
          if (deductErr) {
            console.log(deductErr);

            return res.status(500).json({
              message: "Failed to deduct from account",
            });
          }

          const updateGoalSql = `
            UPDATE goals
            SET saved_amount = saved_amount + ?
            WHERE id = ? AND user_id = ?
          `;

          db.query(
            updateGoalSql,
            [numericAmount, goalId, userId],
            (goalErr) => {
              if (goalErr) {
                console.log(goalErr);

                return res.status(500).json({
                  message: "Failed to add money",
                });
              }

              // Save History (with the account it came from, so a
              // future delete of this entry can restore it there)
              const historySql = `
                INSERT INTO goal_history
                (goal_id, user_id, amount, account_id)
                VALUES (?, ?, ?, ?)
              `;

              db.query(
                historySql,
                [goalId, userId, numericAmount, account_id],
                (historyErr) => {
                  if (historyErr) {
                    console.log(historyErr);

                    return res.status(500).json({
                      message: "History Save Failed",
                    });
                  }

                  notifyUser(userId);

                  res.json({
                    message: "Money Added Successfully",
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};


// Get Goal History
const getGoalHistory = (req, res) => {
  const sql = `
    SELECT
      gh.*,
      accounts.account_name
    FROM goal_history gh
    LEFT JOIN accounts
      ON gh.account_id = accounts.id
      AND accounts.user_id = ?
    WHERE gh.goal_id = ? AND gh.user_id = ?
    ORDER BY gh.created_at DESC
  `;

  db.query(
    sql,
    [
      req.user.id,
      req.params.id,
      req.user.id,
    ],
    (err, rows) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to fetch history",
        });
      }

      res.json(rows);
    }
  );
};


// Delete Money History
const deleteMoneyHistory = (req, res) => {
  const historyId = req.params.id;
  const userId = req.user.id;

  // First get history amount, goal, and account
  const getSql = `
    SELECT
      gh.amount,
      gh.goal_id,
      gh.account_id
    FROM goal_history gh
    INNER JOIN goals g
      ON gh.goal_id = g.id
    WHERE
      gh.id = ?
      AND gh.user_id = ?
      AND g.user_id = ?
  `;

  db.query(
    getSql,
    [historyId, userId, userId],
    (err, rows) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to find history",
        });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          message: "History Not Found",
        });
      }

      const amount = Number(rows[0].amount);
      const goalId = rows[0].goal_id;
      const accountId = rows[0].account_id;

      // Subtract amount from goal
      const updateGoalSql = `
        UPDATE goals
        SET saved_amount = saved_amount - ?
        WHERE id = ? AND user_id = ?
      `;

      db.query(
        updateGoalSql,
        [amount, goalId, userId],
        (err) => {
          if (err) {
            console.log(err);

            return res.status(500).json({
              message: "Failed to update goal",
            });
          }

          const finishDelete = () => {
            const deleteSql = `
              DELETE FROM goal_history
              WHERE id = ? AND user_id = ?
            `;

            db.query(
              deleteSql,
              [historyId, userId],
              (err) => {
                if (err) {
                  console.log(err);

                  return res.status(500).json({
                    message: "Failed to delete history",
                  });
                }

                notifyUser(userId);

                res.json({
                  message: "Money Removed Successfully",
                });
              }
            );
          };

          // Restore the money to the account it came from. Older
          // history rows recorded before this feature existed have
          // no account_id — in that case there's nothing to
          // restore (no account was ever deducted), so just
          // proceed to deleting the history row.
          if (!accountId) {
            return finishDelete();
          }

          const restoreAccountSql = `
            UPDATE accounts
            SET current_balance = current_balance + ?
            WHERE id = ? AND user_id = ?
          `;

          db.query(
            restoreAccountSql,
            [amount, accountId, userId],
            (restoreErr) => {
              if (restoreErr) {
                console.log(restoreErr);

                return res.status(500).json({
                  message: "Failed to restore account balance",
                });
              }

              finishDelete();
            }
          );
        }
      );
    }
  );
};


module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  addMoney,
  getGoalHistory,
  deleteMoneyHistory,
};