const User = require("../model/userModel");
const AppError = require("../utils/appError");
const { filterObj } = require("../utils/helper");
const factory = require("./handlerFactory");

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res, next) => {
  try {
    // 1) create an error if user POSTs password data;
    if (req.body.password || req.body.confirmPassword)
      return next(
        new AppError(
          "This route is not for password updates. please use / updateMyPassword route"
        )
      );
    // 2) Filtered out unwanted fields names that are not allowed to be updated;
    const filteredBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) return next(new AppError("User not found", 404));

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { active: false });
    return res.status(204).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};

exports.createUser = (req, res) => {
  res.status(500).json({
    success: false,
    message: "This route not yet defined please use /signup",
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
