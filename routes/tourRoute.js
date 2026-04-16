const express = require("express");
const {
  getAllTours,
  createTour,
  getTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  updateTour,
  getTourWithin,
  getDistances,
  uploadToursImages,
  resizeTourImages,
  updateTourImages,
} = require("../controllers/tour.controller");
const { aliasTopTours } = require("../middleware/aliasTopTours");
const protectedRoute = require("../middleware/protectedRoute");
const restrictTo = require("../middleware/restrictTo");
const reviewRouter = require("../routes/reviewRoute");

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router
  .route("/tour-stats")
  .get(protectedRoute, restrictTo("admin"), getTourStats);

router
  .route("/monthly-plan/:year")
  .get(
    protectedRoute,
    restrictTo("admin", "lead-guide", "guide"),
    getMonthlyPlan,
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getTourWithin);
router.route("/distances/:latlng/unit/:unit").get(getDistances);

router
  .route("/")
  .get(getAllTours)
  .post(protectedRoute, restrictTo("admin"), createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(protectedRoute, restrictTo("admin"), updateTour)
  .delete(protectedRoute, restrictTo("admin", "lead-guide"), deleteTour);

router.patch(
  "/:id/images",
  protectedRoute,
  restrictTo("admin", "lead-guide"),
  uploadToursImages,
  resizeTourImages,
  updateTourImages,
);

module.exports = router;
