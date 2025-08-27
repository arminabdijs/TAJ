const {
  validateRegisterCategory,
  validateUpdateCategory,
} = require("../validators/category");
const { errorResponse } = require("../helpers/responses");

module.exports.isRegisterCategoryValidators = (req, res, next) => {
  try {
    const result = validateRegisterCategory(req.body);

    if (!result.isValid) {
      return errorResponse(res, 422, "اعتبارسنجی ناموفق بود", result.errors);
    }

    req.body = result.value; 
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.isUpdateCategoryValidators = (req, res, next) => {
  try {
    const { title, href } = req.body;

    if (!title && !href) {
      return res.status(400).json({
        success: false,
        message: "حداقل یکی از فیلدهای عنوان یا آدرس باید ارسال شود.",
      });
    }

    const result = validateUpdateCategory(req.body);

    if (!result.isValid) {
      return errorResponse(res, 422, "اعتبارسنجی ناموفق بود", result.errors);
    }

    req.body = result.value;
    next();
  } catch (err) {
    next(err);
  }
};
