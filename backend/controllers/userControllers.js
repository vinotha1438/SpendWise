const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = (req, res) => {

    const { full_name, email, password } = req.body;

    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], (err, rows) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }

        if (rows.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const insertSql = `
            INSERT INTO users (full_name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(insertSql, [full_name, email, hashedPassword], (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Registration Failed" });
            }

            res.status(201).json({
                message: "User Registered Successfully"
            });

        });

    });

};

// Login User
const loginUser = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, rows) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = rows[0];

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            "spendwise_secret_key",
            {
                expiresIn: "1h"
            }
        );
        console.log("Logged in User ID:",user.id);
        console.log("Generated Token:", token);

        res.status(200).json({
            message: "Login Successful",
            token: token
        });

    });

};

module.exports = {
    registerUser,
    loginUser
};
