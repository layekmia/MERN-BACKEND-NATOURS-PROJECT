const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");

const Tour = require("../model/tourModel");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Only image can upload", 404));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadToursImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeTourImages = async (req, res, next) => {
  if (!req.files || (!req.files.imageCover && !req.files.images)) return next();

  try {
    const tour = await Tour.findById(req.params.id);

    // =========================
    // 1) DELETE OLD COVER
    // =========================
    if (
      req.files.imageCover &&
      tour.imageCover &&
      tour.imageCover.includes("cloudinary")
    ) {
      const publicId = tour.imageCover.split("/upload/")[1].split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    // =========================
    // 2) UPLOAD NEW COVER
    // =========================
    if (req.files.imageCover) {
      const result = await cloudinary.uploader.upload_stream({
        folder: "tours",
        transformation: [
          { width: 2000, height: 1333, crop: "fill", quality: "auto" },
        ],
      });

      // ⚠️ stream handling
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "tours",
            transformation: [
              { width: 2000, height: 1333, crop: "fill", quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) return reject(error);

            req.body.imageCover = result.secure_url;
            resolve(result);
          },
        );

        stream.end(req.files.imageCover[0].buffer);
      });
    }

    // =========================
    // 3) DELETE OLD GALLERY
    // =========================
    if (req.files.images && tour.images?.length > 0) {
      await Promise.all(
        tour.images.map(async (img) => {
          if (img.includes("cloudinary")) {
            const publicId = img.split("/upload/")[1].split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          }
        }),
      );
    }

    // =========================
    // 4) UPLOAD NEW GALLERY
    // =========================

    if (req.files.images) {
      req.body.images = [];

      await Promise.all(
        req.files.images.map(async (file) => {
          await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "tours",
                transformation: [
                  {
                    width: 2000,
                    height: 1333,
                    crop: "fill",
                    quality: "auto",
                  },
                ],
              },
              (error, result) => {
                if (error) return reject(error);

                req.body.images.push(result.secure_url);
                resolve(result);
              },
            );

            stream.end(file.buffer);
          });
        }),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = async (req, res, next) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingQuantity" },
          avgRating: { $avg: "$ratingAverage" },
          minRating: { $min: "$ratingAverage" },
          maxRating: { $max: "$ratingAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMonthlyPlan = async (req, res, next) => {
  try {
    const year = req.params.year * 1;
    console.log(year);

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTourWithin = async (req, res, next) => {
  try {
    const { distance, latlng, unit } = req.params;

    const [lat, lng] = latlng.split(",");

    if (!lat || !lng)
      return new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400,
      );

    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: { $centerSphere: [[lng * 1, lat * 1], radius] },
      },
    });

    res.status(200).json({ success: true, results: tours.length, data: tours });
  } catch (err) {
    next(err);
  }
};

exports.getDistances = async (req, res, next) => {
  try {
    const { latlng, unit } = req.params;

    const [lat, lng] = latlng.split(",");

    const multiplier = unit === "mi" ? 0.000621371 : 0.001;

    if (!lat || !lng)
      return new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400,
      );

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: "distance",
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: distances });
  } catch (err) {
    next(err);
  }
};
