const { isValidObjectId } = require("mongoose");
const { errorResponse } = require("../helpers/responses");

const validateObjectId = (req, res, next) => {
  try {
    const idsToValidate = [
      req.params?.id,
      req.params?.sessionId,
      req.params?.commentId,
      req.params?.productId,
      req.params?.replyId,
      req.params?.messageId,
      req.body?.id,
      req.body?.courseId,
      req.params?.courseId,
    ];

    for (const id of idsToValidate) {
      if (id && !isValidObjectId(id)) {
        return errorResponse(
          res,
          400,
          `شناسه‌ی وارد شده معتبر نیست: ${id}`
        );
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validateObjectId;
