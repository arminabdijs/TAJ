
const errorResponse = (res, status = 500, message = "خطای داخلی سرور", error = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors: Array.isArray(error) ? error : [error || message], 
  });
};


const successResponse = (res, status = 200, message = "عملیات با موفقیت انجام شد", data = null) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

module.exports = {
  errorResponse,
  successResponse,
};
