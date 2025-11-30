class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call parent class (Error) constructor

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Marks this error as "trusted"
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
