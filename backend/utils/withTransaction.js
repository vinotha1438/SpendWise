const pool = require("../config/db");

// Runs `work(connection, done)` inside a real MySQL transaction.
//
// `work` receives a connection to use for every query in this
// transaction (NOT the pool directly — using the pool would give
// each query its own separate connection, defeating the purpose)
// and a `done(err)` callback to call when finished: pass an error
// to roll back everything, or nothing to commit everything.
//
// This exists because several operations (transfers especially,
// but also expense/income add-edit-delete) touch more than one row
// across more than one query, and previously each query was a
// separate round trip with no atomicity — if the process crashed
// or a query failed between steps, money could be deducted from
// one account without ever reaching the other. Wrapping the whole
// sequence in a transaction means either ALL of it applies, or
// NONE of it does.
//
// Usage:
//   withTransaction(res, (connection, done) => {
//     connection.query(sql1, params1, (err) => {
//       if (err) return done(err);
//       connection.query(sql2, params2, (err) => {
//         if (err) return done(err);
//         done(null, { message: "Success" });
//       });
//     });
//   });
function withTransaction(res, work) {
  pool.getConnection((connErr, connection) => {
    if (connErr) {
      console.log("Failed to get DB connection:", connErr);

      return res.status(500).json({
        message: "Database connection failed",
      });
    }

    connection.beginTransaction((beginErr) => {
      if (beginErr) {
        connection.release();

        console.log("Failed to begin transaction:", beginErr);

        return res.status(500).json({
          message: "Database error",
        });
      }

      const done = (err, successBody) => {
        if (err) {
          connection.rollback(() => {
            connection.release();

            console.log("Transaction rolled back:", err);

            res.status(err.statusCode || 500).json({
              message:
                err.clientMessage ||
                "Operation failed and was rolled back",
            });
          });

          return;
        }

        connection.commit((commitErr) => {
          connection.release();

          if (commitErr) {
            console.log("Commit failed:", commitErr);

            return res.status(500).json({
              message: "Failed to save changes",
            });
          }

          res
            .status(successBody?.status || 200)
            .json(successBody?.body || successBody);
        });
      };

      work(connection, done);
    });
  });
}

module.exports = { withTransaction };
