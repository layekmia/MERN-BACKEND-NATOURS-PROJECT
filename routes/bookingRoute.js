const express = require("express");

const {
  getCheckoutSession,
  webhookCheckout,
  getMyBookings,
  getBookings,
} = require("../controllers/booking.controller");
const protectedRoute = require("../middleware/protectedRoute");
const restrictTo = require("../middleware/restrictTo");

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

router.get("/checkout-session/:tourId", protectedRoute, getCheckoutSession);
router.get("/my-bookings", protectedRoute, getMyBookings);
router.get("/", protectedRoute, restrictTo("admin"), getBookings);

module.exports = router;
