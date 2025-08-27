const { validateRegister, validateUpdate } = require("../validators/user");
const { errorResponse } = require("../helpers/responses");

const validatorMiddleware = (validator) => (req, res, next) => {
  const result = validator(req.body);
  if (result !== true) {
    return errorResponse(res, 422, " خطا در اعتبارسنجی اطلاعات", result);
  }
  next()
};

const isRegisterValidators=validatorMiddleware(validateRegister)
const isUpdateValidators =validatorMiddleware(validateUpdate)

module.exports = {
  isRegisterValidators,
  isUpdateValidators,
};