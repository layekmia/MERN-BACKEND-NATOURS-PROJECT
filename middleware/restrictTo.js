const AppError = require("../utils/appError");

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("you don't have permission to perform this action", 401)
      );
    }
    next();
  };
};

module.exports = restrictTo;
 