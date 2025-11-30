const Review = require("../model/reviewModel");
const factory = require("./handlerFactory");

exports.createReview = async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  try {
    const review = await Review.create(req.body);

    const populatedReview = await review.populate([
      {
        path: "user",
        select: "name photo",
      },
      { path: "tour", select: "name" },
    ]);

    res.status(201).json({ success: true, data: populatedReview });
  } catch (err) {
    next(err);
  }
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
