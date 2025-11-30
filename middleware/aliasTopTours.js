exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5"; // everything will be in string;
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";
  next();
};
