const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const JWT_SECRET = process.env.JWT_SECRET || "spendwise_secret_key";

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

// Register User
const registerUser = (req, res) => {
    const { full_name, email, password } = req.body;

    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error",
            });
        }

        if (rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const insertSql = `
            INSERT INTO users (full_name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            insertSql,
            [full_name, email, hashedPassword],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Registration Failed",
                    });
                }

                res.status(201).json({
                    message: "User Registered Successfully",
                });
            }
        );
    });
};

// Login User
const loginUser = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Database Error",
            });
        }

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const user = rows[0];

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
        });
    });
};

// Google Sign-In
// Frontend sends the ID token Google issued after the user picked
// their Google account. We verify it server-side (never trust a
// token the client claims is valid without checking it against
// Google ourselves), then either log the matching user in or
// create a new account for them.
const googleLogin = async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({
            message: "Missing Google credential",
        });
    }

    let payload;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        payload = ticket.getPayload();
    } catch (err) {
        console.log("Google token verification failed:", err);

        return res.status(401).json({
            message: "Invalid Google credential",
        });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const fullName = payload.name || email;

    if (!email) {
        return res.status(400).json({
            message: "Google account has no email",
        });
    }

    // Look up by email — this covers both "already signed in with
    // Google before" (google_id will already be set) and "used to
    // sign in with password, now trying Google for the first time
    // with the same email" (we link the accounts below).
    const findSql = "SELECT * FROM users WHERE email = ?";

    db.query(findSql, [email], (err, rows) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error",
            });
        }

        const issueTokenFor = (user) => {
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );

            res.status(200).json({
                message: "Login Successful",
                token,
            });
        };

        if (rows.length > 0) {
            const existingUser = rows[0];

            // First time this existing (password-based) account
            // uses Google Sign-In — link it, don't create a
            // duplicate account for the same email.
            if (!existingUser.google_id) {
                const linkSql =
                    "UPDATE users SET google_id = ? WHERE id = ?";

                db.query(
                    linkSql,
                    [googleId, existingUser.id],
                    (linkErr) => {
                        if (linkErr) {
                            console.log(linkErr);
                        }

                        issueTokenFor(existingUser);
                    }
                );

                return;
            }

            return issueTokenFor(existingUser);
        }

        // Brand new user — create an account with no password
        // (they'll always sign in via Google, since they never
        // set one).
        const insertSql = `
            INSERT INTO users (full_name, email, password, google_id)
            VALUES (?, ?, NULL, ?)
        `;

        db.query(
            insertSql,
            [fullName, email, googleId],
            (insertErr, result) => {
                if (insertErr) {
                    console.log(insertErr);

                    return res.status(500).json({
                        message: "Failed to create account",
                    });
                }

                issueTokenFor({
                    id: result.insertId,
                    email: email,
                });
            }
        );
    });
};


const getProfile = (req, res) => {
    const sql = `
        SELECT
            id,
            full_name,
            email
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [req.user.id], (err, rows) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error",
            });
        }

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(rows[0]);
    });
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    getProfile,
};