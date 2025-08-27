const { errorResponse } = require("../helpers/responses");

exports.errorHandler = (err, req, res, next) => {
  // Joi / joi-objectid
  if (err.isJoi && Array.isArray(err.details)) {
    const errors = err.details.map((e) => ({
      field: e.path.join("."),
      message: e.message.replace(/\"/g, ""), 
    }));

    console.error("Joi Validation Error:", errors);
    return errorResponse(res, 400, errors);
  }

  // Fastest Validator
  if (Array.isArray(err) && err[0]?.type && err[0]?.message) {
    const errors = err.map((e) => ({
      field: e.field,
      message: e.message,
    }));

    console.error("Fastest Validator Error:", errors);
    return errorResponse(res, 400, errors);
  }

  // JWT errors
  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "توکن شما منقضی شده است. لطفاً مجدداً وارد شوید.");
  }

  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "توکن معتبر نیست. لطفاً دوباره وارد شوید.");
  }

  // سایر خطاها
  const status = err.status || 500;
  const message = err.message || "خطای داخلی سرور.";

  console.error("Unhandled Error:", { status, message });
  return errorResponse(res, status, message);
};
