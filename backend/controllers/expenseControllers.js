const db = require("../config/db");

// Add Expense
const addExpense = (req, res) => {

    const {
    title,
    amount,
    category,
    payment_method,
    expense_date,
    notes
} = req.body;

const user_id = req.user.id;

    const sql = `
        INSERT INTO expenses
        (user_id, title, amount, category, payment_method, expense_date, notes)
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
            expense_date,
            notes
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Failed to add expense"
                });
            }

            res.status(201).json({
                message: "Expense Added Successfully"
            });

        });
};

// Get All Expenses
const getExpenses = (req, res) => {

    const sql = "SELECT * FROM expenses ORDER BY expense_date DESC";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Failed to fetch expenses"
            });
        }

        res.status(200).json(result);

    });

};

// Update Expense
const updateExpense = (req, res) => {

    const { id } = req.params;
    const {
        user_id,
        title,
        amount,
        category,
        payment_method,
        expense_date,
        notes
    } = req.body;

    const sql = `
        UPDATE expenses
        SET title=?, amount=?, category=?, expense_date=?
        WHERE id=?
    `;

    db.query(
        sql,
        [title, amount, category, expense_date, id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Failed to update expense"
                });
            }

            res.status(200).json({
                message: "Expense Updated Successfully"
            });

        }
    );

};

// Delete Expense
const deleteExpense = (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM expenses WHERE id = ?";

    db.query(sql, [id], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Failed to delete expense"
            });
        }

        res.status(200).json({
            message: "Expense Deleted Successfully"
        });

    });

};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};
