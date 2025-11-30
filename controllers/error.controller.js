const AppError = require("../utils/appError"); // Your custom error class

// Handle Mongoose CastError (invalid ObjectId)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400); // 400 → Bad Request
};

// Handle Mongoose ValidationError
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle Mongoose duplicate key error
const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue).join(", ");
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleJwtError = (err) => {
  const value = `Invalid token and ${err.message}. Please login in again`;
  return new AppError(value, 401);
};
const handleJwtExpireError = (err) => {
  const value = `Your token is expired please login again : ${err.message}`;
  return new AppError(value, 401);
};
exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Development: show detailed error
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  // Production: send safe messages
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    // Handle specific Mongoose errors
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.code && err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "JsonWebTokenError") error = handleJwtError(err);
    if (err.name === "TokenExpiredError") error = handleJwtExpireError(err);

    // Operational error → send message
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }

    // Unknown or programming error → don't leak details
    console.error("ERROR 💥", err);
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};
