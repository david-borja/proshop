const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Sometimes we might get a 200 status code eventhough it's an error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // We wanna set res.status to whatever that statusCode is
  res.status(statusCode);
  res.json({
    message: err.message,
    // we also want to have the stack trace, but only if we are NOT in production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
