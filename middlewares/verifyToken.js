const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const { ERROR, FAIL, SUCCESS } = require("../utils/httpStatusText");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw appError(401, "No token provided", FAIL);
    }
    const token = authHeader && authHeader.split(" ")[1];
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; // add the user to the request object to use in the next middleware
        next();
    } catch (err) {
        throw appError(401, "Invalid token", FAIL);
    }
}

module.exports = verifyToken;