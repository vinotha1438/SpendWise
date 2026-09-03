const db = require("../config/db");
const { notifyUser } = require("../socket");
const { withTransaction } = require("../utils/withTransaction");
const {
  isValidAmount,
  isValidDate,
} = require("../utils/validate");

// Add Transfer — moves money between two of the user's own
// accounts. Deliberately does NOT touch expenses or income; a
// transfer is a balance movement, not spending or earning.
//
// Runs inside a real DB transaction: the ownership check, both
// balance updates, and the transfer record insert either all
// succeed together or none of them apply. Previously this was
// four separate round trips with a manual best-effort rollback if
// only the LAST step failed — a crash or dropped connection
// between any of the earlier steps could still have left one
// account debited with no corresponding credit anywhere. A real
// transaction removes that gap entirely.
const addTransfer = (req, res) => {
  const {
    from_account_id,
    to_account_id,
    amount,
    transfer_date,
    notes,
  } = req.body;

  const user_id = req.user.id;

  if (
    !from_account_id ||
    !to_account_id ||
    !isValidAmount(amount) ||
    !isValidDate(transfer_date)
  ) {
    return res.status(400).json({
      message:
        "Please select both accounts, a positive amount, and a date",
    });
  }

  if (Number(from_account_id) === Number(to_account_id)) {
    return res.status(400).json({
      message: "Source and destination accounts must be different",
    });
  }

  withTransaction(res, (connection, done) => {
    // Verify BOTH accounts belong to this user before moving any
    // money — same ownership check pattern used everywhere else.
    // Locks the two rows (FOR UPDATE) so a concurrent transfer
    // touching the same account can't read a stale balance while
    // this transaction is still in progress.
    const accountCheckSql = `
      SELECT id
      FROM accounts
      WHERE id IN (?, ?)
      AND user_id = ?
      FOR UPDATE
    `;

    connection.query(
      accountCheckSql,
      [from_account_id, to_account_id, user_id],
      (checkErr, checkRows) => {
        if (checkErr) {
          return done({
            statusCode: 500,
            clientMessage: "Failed to verify accounts",
          });
        }

        if (!checkRows || checkRows.length !== 2) {
          return done({
            statusCode: 404,
            clientMessage:
              "One or both accounts were not found on your account",
          });
        }

        const deductSql = `
          UPDATE accounts
          SET current_balance = current_balance - ?
          WHERE id = ? AND user_id = ?
        `;

        connection.query(
          deductSql,
          [amount, from_account_id, user_id],
          (deductErr) => {
            if (deductErr) {
              return done({
                statusCode: 500,
                clientMessage: "Failed to debit source account",
              });
            }

            const creditSql = `
              UPDATE accounts
              SET current_balance = current_balance + ?
              WHERE id = ? AND user_id = ?
            `;

            connection.query(
              creditSql,
              [amount, to_account_id, user_id],
              (creditErr) => {
                if (creditErr) {
                  return done({
                    statusCode: 500,
                    clientMessage:
                      "Failed to credit destination account",
                  });
                }

                const insertSql = `
                  INSERT INTO transfers
                  (
                    user_id,
                    from_account_id,
                    to_account_id,
                    amount,
                    transfer_date,
                    notes
                  )
                  VALUES (?, ?, ?, ?, ?, ?)
                `;

                connection.query(
                  insertSql,
                  [
                    user_id,
                    from_account_id,
                    to_account_id,
                    amount,
                    transfer_date,
                    notes || null,
                  ],
                  (insertErr) => {
                    if (insertErr) {
                      return done({
                        statusCode: 500,
                        clientMessage:
                          "Failed to save the transfer record",
                      });
                    }

                    done(null, {
                      status: 201,
                      body: { message: "Transfer Successful" },
                    });

                    // Fires after the transaction has committed —
                    // safe to notify other devices now that the
                    // change is actually durable.
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

// Get Transfers
const getTransfers = (req, res) => {
  const sql = `
    SELECT
      t.*,
      fromAcc.account_name AS from_account_name,
      toAcc.account_name AS to_account_name
    FROM transfers t
    LEFT JOIN accounts fromAcc
      ON t.from_account_id = fromAcc.id
    LEFT JOIN accounts toAcc
      ON t.to_account_id = toAcc.id
    WHERE t.user_id = ?
    ORDER BY t.transfer_date DESC, t.created_at DESC
  `;

  db.query(sql, [req.user.id], (err, rows) => {
    if (err) {
      console.log("Get Transfers Error:", err);

      return res.status(500).json({
        message: "Failed to fetch transfers",
      });
    }

    res.json(rows);
  });
};

// Delete Transfer — reverses both sides of the movement before
// removing the record. Also wrapped in a transaction for the same
// reason as addTransfer: a partial reversal would be worse than no
// reversal at all.
const deleteTransfer = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  withTransaction(res, (connection, done) => {
    const findSql = `
      SELECT *
      FROM transfers
      WHERE id = ? AND user_id = ?
      FOR UPDATE
    `;

    connection.query(
      findSql,
      [id, user_id],
      (findErr, rows) => {
        if (findErr) {
          return done({
            statusCode: 500,
            clientMessage: "Failed to find transfer",
          });
        }

        if (!rows || rows.length === 0) {
          return done({
            statusCode: 404,
            clientMessage: "Transfer not found",
          });
        }

        const transfer = rows[0];

        const reverseSourceSql = `
          UPDATE accounts
          SET current_balance = current_balance + ?
          WHERE id = ? AND user_id = ?
        `;

        connection.query(
          reverseSourceSql,
          [transfer.amount, transfer.from_account_id, user_id],
          (reverseSourceErr) => {
            if (reverseSourceErr) {
              return done({
                statusCode: 500,
                clientMessage: "Failed to reverse transfer",
              });
            }

            const reverseDestSql = `
              UPDATE accounts
              SET current_balance = current_balance - ?
              WHERE id = ? AND user_id = ?
            `;

            connection.query(
              reverseDestSql,
              [transfer.amount, transfer.to_account_id, user_id],
              (reverseDestErr) => {
                if (reverseDestErr) {
                  return done({
                    statusCode: 500,
                    clientMessage: "Failed to reverse transfer",
                  });
                }

                const deleteSql = `
                  DELETE FROM transfers
                  WHERE id = ? AND user_id = ?
                `;

                connection.query(
                  deleteSql,
                  [id, user_id],
                  (deleteErr) => {
                    if (deleteErr) {
                      return done({
                        statusCode: 500,
                        clientMessage:
                          "Failed to delete transfer",
                      });
                    }

                    done(null, {
                      status: 200,
                      body: {
                        message: "Transfer Deleted Successfully",
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

module.exports = {
  addTransfer,
  getTransfers,
  deleteTransfer,
};