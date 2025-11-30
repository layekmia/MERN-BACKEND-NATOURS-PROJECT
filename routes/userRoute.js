const express = require("express");
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require("../controllers/user.controller");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth.controller");
const protectRoute = require("../middleware/protectRoute");
const restrictTo = require("../middleware/restrictTo");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", protectRoute, updatePassword);

router.use(protectRoute); // It apply this middleware all the route in below

router.get("/me", getMe, getUser);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);

// This route only for admin;
router.use(restrictTo("admin"));

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
