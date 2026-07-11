const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No Token"
        });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
        const decoded = jwt.verify(token, "spendwise_secret_key");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};

module.exports = verifyToken;