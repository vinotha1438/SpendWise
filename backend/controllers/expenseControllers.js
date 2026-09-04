const db = require("../config/db");
const { notifyUser } = require("../socket");
const { withTransaction } = require("../utils/withTransaction");
const {
  isValidAmount,
  isNonEmptyString,
  isValidDate,
} = require("../utils/validate");

const addExpense = (req, res) => {
  const {
    title,
    amount,
    category,
    payment_method,
    account_id,
    expense_date,
    notes,
    where_to_pay,
  } = req.body;

  const user_id = req.user.id;

  if (
    !isNonEmptyString(title) ||
    !isValidAmount(amount) ||
    !isNonEmptyString(category) ||
    !isNonEmptyString(payment_method) ||
    !account_id ||
    !isValidDate(expense_date)
  ) {
    return res.status(400).json({
      message:
        "Please provide a valid title, a positive amount, category, payment method, account, and date",
    });
  }

  withTransaction(res, (connection, done) => {
    const accountCheckSql = `
      SELECT id
      FROM accounts
      WHERE id = ?
      AND user_id = ?
      FOR UPDATE
    `;

    connection.query(
      accountCheckSql,
      [account_id, user_id],
      (accountErr, accountResult) => {
        if (accountErr) {
          return done({
            statusCode: 500,
            clientMessage: "Failed to verify account",
          });
        }

        if (accountResult.length === 0) {
          return done({
            statusCode: 404,
            clientMessage: "Account not found",
          });
        }

        const expenseSql = `
          INSERT INTO expenses
          (
            user_id,
            title,
            amount,
            category,
            payment_method,
            account_id,
            expense_date,
            notes,
            where_to_pay
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(
          expenseSql,
          [
            user_id,
            title,
            amount,
            category,
            payment_method,
            account_id,
            expense_date,
            notes,
            where_to_pay || null,
          ],
          (expenseErr, result) => {
            if (expenseErr) {
              return done({
                statusCode: 500,
                clientMessage: "Failed to add expense",
              });
            }

            const balanceSql = `
              UPDATE accounts
              SET current_balance =
                current_balance - ?
              WHERE id = ?
              AND user_id = ?
            `;

            connection.query(
              balanceSql,
              [amount, account_id, user_id],
              (balanceErr) => {
                if (balanceErr) {
                  return done({
                    statusCode: 500,
                    clientMessage:
                      "Failed to update account balance",
                  });
                }

                const notificationSql = `
                  INSERT INTO notifications
                  (user_id, title, message, is_read)
                  VALUES (?, ?, ?, ?)
                `;

                const notificationMessage =
                  `₹${Number(amount).toLocaleString("en-IN")} ` +
                  `spent on ${category || "Others"}`;

                connection.query(
                  notificationSql,
                  [
                    user_id,
                    "Expense Added",
                    notificationMessage,
                    0,
                  ],
                  (notificationErr) => {
                    if (notificationErr) {
                      console.log(
                        "Notification Error:",
                        notificationErr
                      );
                    }

                    done(null, {
                      status: 201,
                      body: {
                        message: "Expense Added Successfully",
                        expenseId: result.insertId,
                      },
                    });

                    notifyUser(user_id);
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};

const getExpenses = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT
      expenses.*,
      accounts.account_name
    FROM expenses
    LEFT JOIN accounts
      ON expenses.account_id = accounts.id
      AND accounts.user_id = ?
    WHERE expenses.user_id = ?
    ORDER BY expenses.expense_date DESC
  `;

  db.query(
    sql,
    [user_id, user_id],
    (err, result) => {
      if (err) {
        console.log(
          "Get Expenses Error:",
          err
        );

        return res.status(500).json({
          message: "Failed to fetch expenses",
        });
      }

      return res.status(200).json(result);
    }
  );
};


const updateExpense = (req, res) => {
  const { id } = req.params;

  const {
    title,
    amount,
    category,
    payment_method,
    account_id,
    expense_date,
    notes,
    where_to_pay,
  } = req.body;

  const user_id = req.user.id;

  if (
    !isNonEmptyString(title) ||
    !isValidAmount(amount) ||
    !isNonEmptyString(category) ||
    !isNonEmptyString(payment_method) ||
    !account_id ||
    !isValidDate(expense_date)
  ) {
    return res.status(400).json({
      message:
        "Please provide a valid title, a positive amount, category, payment method, account, and date",
    });
  }

  withTransaction(res, (connection, done) => {
    const oldExpenseSql = `
      SELECT
        amount,
        account_id
      FROM expenses
      WHERE id = ?
      AND user_id = ?
      FOR UPDATE
    `;

    connection.query(
      oldExpenseSql,
      [id, user_id],
      (oldErr, oldResult) => {
        if (oldErr) {
          return done({
            statusCode: 500,
            clientMessage: "Failed to find expense",
          });
        }

        if (oldResult.length === 0) {
          return done({
            statusCode: 404,
            clientMessage: "Expense not found",
          });
        }

        const oldAmount = Number(
          oldResult[0].amount || 0
        );

        const oldAccountId =
          oldResult[0].account_id;

        const accountCheckSql = `
          SELECT id
          FROM accounts
          WHERE id = ?
          AND user_id = ?
          FOR UPDATE
        `;

        connection.query(
          accountCheckSql,
          [account_id, user_id],
          (accountErr, accountResult) => {
            if (accountErr) {
              return done({
                statusCode: 500,
                clientMessage: "Failed to verify account",
              });
            }

            if (accountResult.length === 0) {
              return done({
                statusCode: 404,
                clientMessage: "Account not found",
              });
            }

            const updateSql = `
              UPDATE expenses
              SET
                title = ?,
                amount = ?,
                category = ?,
                payment_method = ?,
                account_id = ?,
                expense_date = ?,
                notes = ?,
                where_to_pay = ?
              WHERE id = ?
              AND user_id = ?
            `;

            connection.query(
              updateSql,
              [
                title,
                amount,
                category,
                payment_method,
                account_id,
                expense_date,
                notes,
                where_to_pay || null,
                id,
                user_id,
              ],
              (updateErr, updateResult) => {
                if (updateErr) {
                  return done({
                    statusCode: 500,
                    clientMessage: "Failed to update expense",
                  });
                }

                if (updateResult.affectedRows === 0) {
                  return done({
                    statusCode: 404,
                    clientMessage: "Expense not found",
                  });
                }

                if (
                  Number(oldAccountId) ===
                  Number(account_id)
                ) {
                  const difference =
                    Number(amount) - oldAmount;

                  const balanceSql = `
                    UPDATE accounts
                    SET current_balance =
                      current_balance - ?
                    WHERE id = ?
                    AND user_id = ?
                  `;

                  connection.query(
                    balanceSql,
                    [
                      difference,
                      account_id,
                      user_id,
                    ],
                    (balanceErr) => {
                      if (balanceErr) {
                        return done({
                          statusCode: 500,
                          clientMessage:
                            "Failed to update account balance",
                        });
                      }

                      done(null, {
                        status: 200,
                        body: {
                          message:
                            "Expense Updated Successfully",
                        },
                      });

                      notifyUser(user_id);
                    }
                  );

                  return;
                }

                const restoreOldAccountSql = `
                  UPDATE accounts
                  SET current_balance =
                    current_balance + ?
                  WHERE id = ?
                  AND user_id = ?
                `;

                connection.query(
                  restoreOldAccountSql,
                  [
                    oldAmount,
                    oldAccountId,
                    user_id,
                  ],
                  (restoreErr) => {
                    if (restoreErr) {
                      return done({
                        statusCode: 500,
                        clientMessage:
                          "Failed to restore old account balance",
                      });
                    }

                    const deductNewAccountSql = `
                      UPDATE accounts
                      SET current_balance =
                        current_balance - ?
                      WHERE id = ?
                      AND user_id = ?
                    `;

                    connection.query(
                      deductNewAccountSql,
                      [
                        Number(amount),
                        account_id,
                        user_id,
                      ],
                      (deductErr) => {
                        if (deductErr) {
                          return done({
                            statusCode: 500,
                            clientMessage:
                              "Failed to update new account balance",
                          });
                        }

                        done(null, {
                          status: 200,
                          body: {
                            message:
                              "Expense Updated Successfully",
                          },
                        });

                        notifyUser(user_id);
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};


const deleteExpense = (req, res) => {
  const { id } = req.params;

  const user_id = req.user.id;

  withTransaction(res, (connection, done) => {
    const getExpenseSql = `
      SELECT
        amount,
        account_id
      FROM expenses
      WHERE id = ?
      AND user_id = ?
      FOR UPDATE
    `;

    connection.query(
      getExpenseSql,
      [id, user_id],
      (err, result) => {
        if (err) {
          return done({
            statusCode: 500,
            clientMessage: "Failed to find expense",
          });
        }

        if (result.length === 0) {
          return done({
            statusCode: 404,
            clientMessage: "Expense not found",
          });
        }

        const amount = Number(
          result[0].amount || 0
        );

        const accountId =
          result[0].account_id;

        const deleteSql = `
          DELETE FROM expenses
          WHERE id = ?
          AND user_id = ?
        `;

        connection.query(
          deleteSql,
          [id, user_id],
          (deleteErr, deleteResult) => {
            if (deleteErr) {
              return done({
                statusCode: 500,
                clientMessage: "Failed to delete expense",
              });
            }

            if (deleteResult.affectedRows === 0) {
              return done({
                statusCode: 404,
                clientMessage: "Expense not found",
              });
            }

            const balanceSql = `
              UPDATE accounts
              SET current_balance =
                current_balance + ?
              WHERE id = ?
              AND user_id = ?
            `;

            connection.query(
              balanceSql,
              [
                amount,
                accountId,
                user_id,
              ],
              (balanceErr) => {
                if (balanceErr) {
                  return done({
                    statusCode: 500,
                    clientMessage:
                      "Failed to update account balance",
                  });
                }

                done(null, {
                  status: 200,
                  body: {
                    message: "Expense Deleted Successfully",
                  },
                });

                notifyUser(user_id);
              }
            );
          }
        );
      }
    );
  });
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};