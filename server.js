require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/dbConnect");

connectDB();

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION  shutting down gracefully...");
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTIONS SHUTTING DOWN");
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
