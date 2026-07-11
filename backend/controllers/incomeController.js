const db = require("../config/db");
console.log("******** NEW INCOME CONTROLLER LOADED ********");

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

    console.log("GET INCOME FUNCTION EXECUTED");

    return res.json({
        test: "SUCCESS"
    });

};


// Update Income
const updateIncome = (req, res) => {
  res.json({
    message: "Update Income Working",
  });
};

// Delete Income
const deleteIncome = (req, res) => {
  res.json({
    message: "Delete Income Working",
  });
};

module.exports = {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
};