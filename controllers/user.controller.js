const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const User = require("../model/userModel");
const AppError = require("../utils/appError");
const { filterObj } = require("../utils/helper");
const factory = require("./handlerFactory");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "users",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [
      { width: 500, height: 500, crop: "fill", quality: "auto" },
    ],
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Not an image! Please upload image", 400), false);
    }
  },
});

exports.uploadUserPhoto = upload.single("photo");

exports.handleUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const user = req.user;

    // Delete old image from Cloudinary
    if (user.photo && user.photo !== "default.jpg") {
      const publicId = user.photo.split("/upload/")[1].split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    next();
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    // 1) create an error if user POSTs password data;
    if (req.body.password || req.body.confirmPassword)
      return next(
        new AppError(
          "This route is not for password updates. please use / updateMyPassword route",
        ),
      );
    // 2) Filtered out unwanted fields names that are not allowed to be updated;
    const filteredBody = filterObj(req.body, "name", "email");
    if (req.file) filteredBody.photo = req.file.path;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) return next(new AppError("User not found", 404));

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
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
