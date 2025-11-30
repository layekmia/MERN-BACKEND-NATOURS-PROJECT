const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const User = require("../model/userModel");

const protectRoute = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("your are not login, please login to get access", 401)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("user no longer exist", 401));

    if (user.changePasswordAfter(decoded.iat)) {
      return next(
        new AppError("user recently changed password please login again", 401)
      );
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = protectRoute;
