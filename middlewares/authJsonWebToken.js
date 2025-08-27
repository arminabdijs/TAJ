const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/BlacklistToken");
const userModel = require("../models/User");
const { errorResponse } = require("../helpers/responses");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse(res, 401, "توکن ارسال نشده است.");
    }

    const token = authHeader.split(" ")[1];

    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted) {
      return errorResponse(res, 401, "توکن نامعتبر شده است. لطفاً دوباره وارد شوید.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("-password -__v");
    if (!user) {
      return errorResponse(res, 404, "کاربر یافت نشد.");
    }

    if (!user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
      return errorResponse(res, 403, "برای این کاربر نقشی تعریف نشده است.");
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 401, "توکن نامعتبر یا منقضی شده است.");
  }
};
