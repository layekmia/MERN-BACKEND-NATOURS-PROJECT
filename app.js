const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");

const tourRouter = require("./routes/tourRoute");
const useRouter = require("./routes/userRoute");
const reviewRouter = require("./routes/reviewRoute");
const AppError = require("./utils/appError");
const { globalErrorHandler } = require("./controllers/error.controller");

// Middlewares;
const app = express();

// Global middleware

app.set('query parser', 'extended');
app.use(express.urlencoded({ extended: true }));


app.use(cors({origin: "*"}));

// set Security HTTP headers;
app.use(helmet());

app.use(express.json());

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingAverage",
      "ratingQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, Please try again in an hour",
});
app.use("/api", limiter);

app.use(express.static(`${__dirname}/public/`));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Natours API!",
    version: "1.0.0",
    documentation: "/api/v1/docs",
    availableEndpoints: {
      tours: "/api/v1/tours",
      users: "/api/v1/users",
    },
    serverTime: new Date().toISOString(),
  });
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", useRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`), 404);
});

app.use(globalErrorHandler);

module.exports = app;
