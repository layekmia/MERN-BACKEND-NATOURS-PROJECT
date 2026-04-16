const Tour = require("../model/tourModel");
const Booking = require("../model/bookingModel");
const User = require("../model/userModel");

exports.getAdminStats = async (req, res, next) => {
  try {
    const totalTours = await Tour.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenueResult = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const popularToursAgg = await Booking.aggregate([
      {
        $group: {
          _id: "$tour",
          bookingCount: { $sum: 1 },
        },
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 5 },
    ]);

    const tourIds = popularToursAgg.map((item) => item._id);
    const popularTours = await Tour.find({ _id: { $in: tourIds } });

    res.status(200).json({
      success: true,
      data: {
        totalTours,
        totalUsers,
        totalBookings,
        totalRevenue,
        recentBookings,
        popularTours,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllGuides = async (req, res, next) => {
  try {
    const guides = await User.find({ role: { $in: ["guide", "lead-guide"] } });

    return res
      .status(200)
      .json({ success: true, results: guides.length, data: guides });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["user", "guide", "lead-guide", "admin"];
    if (!allowedRoles.includes(role)) {
      return next(new AppError("Invalid role", 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
