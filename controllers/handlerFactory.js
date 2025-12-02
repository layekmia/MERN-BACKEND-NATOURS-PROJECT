const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

// This work because of clouser in JavaScript;
exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 400));
    }

    res.status(200).json({
      success: true,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that id", 400));
    }

    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.create(req.body);

    res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = (Model, popOptions) => async (req, res, next) => {
  try {
    let query = Model.findById(req.params.id);
    if (popOptions) query = Model.findById(req.params.id).populate(popOptions);

    // we should use custom query middleware for populate data because don't repeat your self;
    const doc = await query;

    if (!doc) {
      return next(new AppError("no document found with that ID", 404));
    }

    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

exports.getAll = (Model) => async (req, res, next) => {

  try {
    // To allow for nested GET reviews on tour (small hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      success: true,
      results: doc.length,
      data: doc,
    });
  } catch (err) {
    next(err);
  }
};
