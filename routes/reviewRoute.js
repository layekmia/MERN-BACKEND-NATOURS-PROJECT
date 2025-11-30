const express = require("express");
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  getReview,
} = require("../controllers/review.controller");
const protectRoute = require("../middleware/protectRoute");
const restrictTo = require("../middleware/restrictTo");

// Because by default, child router does NOT have access to parent router params.
const router = express.Router({ mergeParams: true });

router.use(protectRoute);
router.route("/").post(restrictTo("user"), createReview).get(getAllReviews);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
