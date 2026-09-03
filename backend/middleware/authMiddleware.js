const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "spendwise_secret_key";

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No Token"
        });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};

module.exports = verifyToken;