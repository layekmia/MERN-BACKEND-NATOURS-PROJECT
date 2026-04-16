const express = require("express");
const protectedRoute = require("../middleware/protectedRoute");
const restrictTo = require("../middleware/restrictTo");
const {
  getAdminStats,
  getAllGuides,
  updateUserRole,
} = require("../controllers/admin.controller");

const router = express.Router();

router.use(protectedRoute);
router.use(restrictTo("admin"));

router.get("/stats", getAdminStats);
router.get("/guides", getAllGuides);
router.patch("/:id/role", restrictTo("admin"), updateUserRole);

module.exports = router;
