const logger = require("./logger");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }
  next();
};

const successResponse = (res, data, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, error, statusCode = 500) => {
  logger.error(error);
  res.status(statusCode).json({
    success: false,
    error: error.message || "Internal server error",
  });
};

module.exports = {
  asyncHandler,
  validateRequest,
  successResponse,
  errorResponse,
};
