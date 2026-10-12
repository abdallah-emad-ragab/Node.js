const appError = require("../utils/appError");
const { ERROR, FAIL, SUCCESS } = require("../utils/httpStatusText");

module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.user;
        if (!allowedRoles.includes(role)) {
            return next(appError(403, "You do not have permission to perform this action", FAIL));
        }
        next();
    }
}