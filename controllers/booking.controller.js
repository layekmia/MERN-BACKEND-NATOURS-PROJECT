const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../model/bookingModel");
const Tour = require("../model/tourModel");
const User = require("../model/userModel");
const AppError = require("../utils/appError");

// CREATE CHECKOUT SESSION
exports.getCheckoutSession = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      success_url: `${process.env.CLIENT_URL}/booking-success`,
      cancel_url: `${process.env.CLIENT_URL}/tour/${tour.slug}`,

      customer_email: req.user.email,
      client_reference_id: req.params.tourId,

      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: tour.price * 100,
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [tour.imageCover],
            },
          },
          quantity: 1,
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("tour")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();

    return res.status(200).json({ status: "success", data:bookings });
  } catch (error) {
    next(error);
  }
};

// CREATE BOOKING (INTERNAL)
const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const userEmail = session.customer_email;
  const price = session.amount_total / 100;

  const user = await User.findOne({ email: userEmail });

  if (!user) return;

  await Booking.create({
    tour,
    user: user._id,
    price,
    pad: true,
  });
};

// STRIPE WEBHOOK

exports.webhookCheckout = async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return new AppError(`Webhook error: ${err.message}`, 404);
    }

    if (event.type === "checkout.session.completed") {
      await createBookingCheckout(event.data.object);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
