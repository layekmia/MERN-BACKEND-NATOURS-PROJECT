const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Booking must belong to Tour!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user"],
  },
  price: {
    type: Number,
    required: [true, "booking must have a price"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  pad: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function () {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
