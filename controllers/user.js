const userModel = require("../models/User");
const banUserModel = require("../models/Ban");
const { errorResponse, successResponse } = require("../helpers/responses");

exports.banUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mainUser = await userModel.findById(id);

    if (!mainUser) {
      return errorResponse(res, 404, "کاربر پیدا نشد");
    }

    if (mainUser.roles.includes("SUPER_ADMIN")) {
      return errorResponse(res, 403, "شما نمی‌توانید سوپر ادمین را مسدود کنید");
    }

    if (!mainUser.accepted) {
      return errorResponse(res, 409, "کاربر قبلاً مسدود شده است");
    }

    const isBannedBefore = await banUserModel.findOne({ email: mainUser.email });

     if (isBannedBefore) {
      return errorResponse(res, 409, "این کاربر قبلاً در لیست مسدودی قرار گرفته است");
    }

    mainUser.accepted = false;
    await mainUser.save();

    
    await banUserModel.create({ email: mainUser.email });

    return successResponse(res, 200, "کاربر با موفقیت مسدود شد");

  } catch (e) {
    next(e)
  }
};
