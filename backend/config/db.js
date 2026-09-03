const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "spendwise_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick startup check — grabs one connection from the pool just to
// confirm the database is reachable, then releases it back. Unlike
// a single createConnection(), if a connection later drops, the
// pool transparently opens a new one for the next query instead of
// taking down every subsequent request.
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL pool connection failed:", err.message);
    return;
  }

  console.log("✅ Connected to MySQL!");
  connection.release();
});

module.exports = pool;