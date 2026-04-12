const express = require("express");

const {
  getCheckoutSession,
  webhookCheckout,
} = require("../controllers/booking.controller");
const protectedRoute = require("../middleware/protectedRoute");

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

router.get("/checkout-session/:tourId", protectedRoute, getCheckoutSession);

module.exports = router;
