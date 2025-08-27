const {
  validateCreate,
  validateUpdate,
  validateCreateSession,
} = require("../validators/course");

const { errorResponse } = require("../helpers/responses");
const path = require("path");

const createValidator = (validatorFn, filePathFolder, isFileRequired = false) => {
  return (req, res, next) => {
    try {
      if (isFileRequired && !req.file) {
        return errorResponse(res, 400, "آپلود فایل الزامی است");
      }

      const error = validatorFn(req.body);
      if (req.file && error !== true) {
        const filePath = path.join("public", filePathFolder, req.file.filename);
        deleteFileIfExists(filePath);
      }

      if (error !== true) {
        return errorResponse(res, 422, "اعتبارسنجی ناموفق بود", error);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  isValidateCreateCourse: createValidator(validateCreate, "courses/covers", true),
  isValidateUpdateCourse: createValidator(validateUpdate, "courses/covers"),
  isValidateCreateSession: createValidator(validateCreateSession, "courses/videos", true),
};
