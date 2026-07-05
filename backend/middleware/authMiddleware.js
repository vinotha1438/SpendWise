const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    console.log("Authorization Header =", authHeader);

    if (!authHeader) {
        return res.status(401).json({
            message: "No Token"
        });
    }

    const token = authHeader.replace("Bearer ", "").replace(/"/g, "");

    console.log("Token =", token);

    try {

        const decoded = jwt.verify(token.trim(), "spendwise_secret_key");

        console.log("Decoded =", decoded);

        req.user = decoded;

        next();

    } catch (err) {

        console.log(err);

        return res.status(401).json({
            message: "Invalid Token"
        });

    }

};

module.exports = verifyToken;