const db = require("../config/db");
const { notifyUser } = require("../socket");
const { withTransaction } = require("../utils/withTransaction");
const {
  isValidAmount,
  isNonEmptyString,
  isValidDate,
} = require("../utils/validate");

// =====================================================
// ADD INCOME
// =====================================================

const addIncome = (req, res) => {
  const {
    title,
    amount,
    category,
    payment_method,
    account_id,
    income_date,
    notes,
  } = req.body;

  const user_id = req.user.id;

  if (
    !isNonEmptyString(title) ||
    !isValidAmount(amount) ||
    !isNonEmptyString(category) ||
    !isNonEmptyString(payment_method) ||
    !account_id ||
    !isValidDate(income_date)
  ) {
    return res.status(400).json({
      message:
        "Please provide a valid title, a positive amount, category, payment method, account, and date",
    });
  }

  // Insert + balance credit now run inside a single DB transaction
  // — mirrors the same fix applied to expenseControllers.js.
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

        const incomeSql = `
          INSERT INTO income
          (
            user_id,
            title,
            amount,
            category,
            payment_method,
            account_id,
            income_date,
            notes
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(
          incomeSql,
          [
            user_id,
            title,
            amount,
            category,
            payment_method,
            account_id,
            income_date,
            notes,
          ],
          (incomeErr, result) => {
            if (incomeErr) {
              return done({
                statusCode: 500,
                clientMessage: "Failed to add income",
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
              [amount, account_id, user_id],
              (balanceErr) => {
                if (balanceErr) {
                  return done({
                    statusCode: 500,
                    clientMessage:
                      "Failed to update account balance",
                  });
                }

                done(null, {
                  status: 201,
                  body: {
                    message: "Income Added Successfully",
                    incomeId: result.insertId,
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


// =====================================================
// GET ALL INCOME
// =====================================================

const getIncome = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT
      income.*,
      accounts.account_name
    FROM income
    LEFT JOIN accounts
      ON income.account_id = accounts.id
      AND accounts.user_id = ?
    WHERE income.user_id = ?
    ORDER BY income.income_date DESC
  `;

  db.query(
    sql,
    [user_id, user_id],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to fetch income",
        });
      }

      return res.status(200).json(result);
    }
  );
};


// =====================================================
// UPDATE INCOME
// =====================================================

const updateIncome = (req, res) => {
  const { id } = req.params;

  const {
    title,
    amount,
    category,
    payment_method,
    account_id,
    income_date,
    notes,
  } = req.body;

  const user_id = req.user.id;

  if (
    !isNonEmptyString(title) ||
    !isValidAmount(amount) ||
    !isNonEmptyString(category) ||
    !isNonEmptyString(payment_method) ||
    !account_id ||
    !isValidDate(income_date)
  ) {
    return res.status(400).json({
      message:
        "Please provide a valid title, a positive amount, category, payment method, account, and date",
    });
  }

  withTransaction(res, (connection, done) => {
    const getOldIncomeSql = `
      SELECT
        amount,
        account_id
      FROM income
      WHERE id = ?
      AND user_id = ?
      FOR UPDATE
    `;

    connection.query(
      getOldIncomeSql,
      [id, user_id],
      (oldErr, oldResult) => {
        if (oldErr) {
          return done({
            statusCode: 500,
            clientMessage: "Failed to find income",
          });
        }

        if (oldResult.length === 0) {
          return done({
            statusCode: 404,
            clientMessage: "Income not found",
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
              UPDATE income
              SET
                title = ?,
                amount = ?,
                category = ?,
                payment_method = ?,
                account_id = ?,
                income_date = ?,
                notes = ?
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
                income_date,
                notes,
                id,
                user_id,
              ],
              (updateErr, updateResult) => {
                if (updateErr) {
                  return done({
                    statusCode: 500,
                    clientMessage: "Failed to update income",
                  });
                }

                if (updateResult.affectedRows === 0) {
                  return done({
                    statusCode: 404,
                    clientMessage: "Income not found",
                  });
                }

                // SAME ACCOUNT
                if (
                  Number(oldAccountId) ===
                  Number(account_id)
                ) {
                  const difference =
                    Number(amount) - oldAmount;

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
                            "Income Updated Successfully",
                        },
                      });

                      notifyUser(user_id);
                    }
                  );

                  return;
                }

                // ACCOUNT CHANGED
                const removeOldBalanceSql = `
                  UPDATE accounts
                  SET current_balance =
                    current_balance - ?
                  WHERE id = ?
                  AND user_id = ?
                `;

                connection.query(
                  removeOldBalanceSql,
                  [
                    oldAmount,
                    oldAccountId,
                    user_id,
                  ],
                  (removeErr) => {
                    if (removeErr) {
                      return done({
                        statusCode: 500,
                        clientMessage:
                          "Failed to update old account balance",
                      });
                    }

                    const addNewBalanceSql = `
                      UPDATE accounts
                      SET current_balance =
                        current_balance + ?
                      WHERE id = ?
                      AND user_id = ?
                    `;

                    connection.query(
                      addNewBalanceSql,
                      [
                        amount,
                        account_id,
                        user_id,
                      ],
                      (addErr) => {
                        if (addErr) {
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
                              "Income Updated Successfully",
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


// =====================================================
// DELETE INCOME
// =====================================================

const deleteIncome = (req, res) => {
  const { id } = req.params;

  const user_id = req.user.id;

  withTransaction(res, (connection, done) => {
    const getIncomeSql = `
      SELECT
        amount,
        account_id
      FROM income
      WHERE id = ?
      AND user_id = ?
      FOR UPDATE
    `;

    connection.query(
      getIncomeSql,
      [id, user_id],
      (err, result) => {
        if (err) {
          return done({
            statusCode: 500,
            clientMessage: "Failed to find income",
          });
        }

        if (result.length === 0) {
          return done({
            statusCode: 404,
            clientMessage: "Income not found",
          });
        }

        const amount = Number(
          result[0].amount || 0
        );

        const accountId =
          result[0].account_id;

        const deleteSql = `
          DELETE FROM income
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
                clientMessage: "Failed to delete income",
              });
            }

            if (deleteResult.affectedRows === 0) {
              return done({
                statusCode: 404,
                clientMessage: "Income not found",
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
                    message: "Income Deleted Successfully",
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


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
};