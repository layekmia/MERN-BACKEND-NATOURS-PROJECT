// Handled Unexpected Synchronous errors;
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error("Error:", err.name, err.message);

  // Exit immediately (app is corrupted)
  process.exit(1);
});

// Config and imports
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/dbConnect");

connectDB();
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`App running on port ${process.env.PORT || 5000}`);
});

// Handled Unexpected Asynchronous errors
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down...");

  console.error("Error:", err.name, err.message);

  // Graceful shutdown
  server.close(() => {
    console.log("💡 Server closed.");
    process.exit(1);
  });
});
