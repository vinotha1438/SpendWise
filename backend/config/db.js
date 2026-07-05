const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sri@1438",
  database: "spendwise_db",
  port: 3306
});

connection.connect(function(err) {
  if (err) {
    console.error(err);
    return;
  }

  console.log("✅ Connected to MySQL!");
});

module.exports = connection;
