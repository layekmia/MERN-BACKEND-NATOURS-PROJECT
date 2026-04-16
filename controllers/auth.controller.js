const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../model/userModel");
const AppError = require("../utils/appError");
const { createSendToken } = require("../utils/helper");
const { sendEmail } = require("../utils/email");

exports.signUp = async (req, res, next) => {
  const defaultPhoto =
    "https://res.cloudinary.com/dog7nlmag/image/upload/v1776093318/default_jc0ukh.jpg";

  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      role: req.body.role,
      photo: defaultPhoto,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 404));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new AppError("Incorrect email or password", 401));

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) return next(new AppError("wrong password", 401));

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new AppError("There is no user with this email address", 401),
      );
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset your Natours password",
        message: resetURL,
      });
    } catch (err) {
      // rollback if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          "There was an error sending the email. Try again later",
          500,
        ),
      );
    }

    res.status(200).json({
      success: true,
      message: "Token sent to email",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    if (!user)
      return next(new AppError("Token is invalid or has expired", 401));

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) return next(new AppError("User not found", 404));

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!strongPasswordRegex.test(req.body.password)) {
      return next(
        new AppError(
          "Password must be at least 8 characters, include uppercase, lowercase and a number",
          400,
        ),
      );
    }

    const isCorrect = await bcrypt.compare(
      req.body.currentPassword,
      user.password,
    );

    if (!isCorrect) {
      return next(new AppError("Current password is not incorrect", 401));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
