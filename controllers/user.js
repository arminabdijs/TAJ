const userModel = require("../models/User");
const banUserModel = require("../models/Ban");
const { errorResponse, successResponse } = require("../helpers/responses");
const createPaginationData = require("../utils/pagination");
const { updateUserService } = require("../services/userService");

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

    const isBannedBefore = await banUserModel.findOne({
      email: mainUser.email,
    });

    if (isBannedBefore) {
      return errorResponse(
        res,
        409,
        "این کاربر قبلاً در لیست مسدودی قرار گرفته است"
      );
    }

    mainUser.accepted = false;
    await mainUser.save();

    await banUserModel.create({ email: mainUser.email });

    return successResponse(res, 200, "کاربر با موفقیت مسدود شد");
  } catch (e) {
    next(e);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 10 : limit;

    const totalUsers = await userModel.countDocuments();

    const users = await userModel
      .find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password");

    return successResponse(res, 200, "لیست کاربران با موفقیت دریافت شد", {
      users,
      pagination: createPaginationData(page, limit, totalUsers, "کاربر"),
    });
  } catch {
    return errorResponse(res, 500, "دریافت کاربران با خطا مواجه شد", err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await updateUserService(req.user._id, req.body, req.file);

    return successResponse(
      res,
      200,
      "اطلاعات کاربر با موفقیت به‌روزرسانی شد",
      user
    );
  } catch (err) {
    next(err);
  }
};

exports.deactivateMe = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId);

    if (!user) {
      return errorResponse(res, 404, "کاربر یافت نشد");
    }

    if (user.accepted === false) {
      return errorResponse(res, 409, "اکانت شما قبلاً غیرفعال شده است");
    }

    user.accepted = false;
    await user.save();

    return successResponse(res, 200, "اکانت شما با موفقیت غیرفعال شد");
  } catch (err) {
    next(err);
  }
};

exports.removeUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);

    if (!user) {
      return errorResponse(res, 404, "کاربر مورد نظر یافت نشد");
    }

    if (user.roles.includes("SUPER_ADMIN")) {
      return errorResponse(res, 403, "شما نمی‌توانید ادمین را حذف کنید");
    }

    await userModel.findByIdAndDelete(id);

    return successResponse(res, 200, "کاربر با موفقیت حذف شد");
  } catch (err) {
    next(err);
  }
};

exports.addRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const allowedRoles = ["USER", "SUPER_ADMIN", "TEACHER"];

    if (!allowedRoles.includes(role)) {
      return errorResponse(res, 400, "نقش وارد شده معتبر نیست");
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(id, { $addToSet: { roles: role } }, { new: true })
      .select("-password");

    if (!updatedUser) {
      return errorResponse(res, 404, "کاربر یافت نشد");
    }

    return successResponse(res, 200, "نقش با موفقیت اضافه شد", {
      roles: updatedUser.roles,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = [
      "USER",
      "SUPER_ADMIN",
      "SUPPORT",
      "TEACHER",
    ];

    if (!allowedRoles.includes(role)) {
      return errorResponse(res, 400, "نقش نامعتبر است");
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(id, { $pull: { roles: role } }, { new: true })
      .select("-password");

    if (!updatedUser) {
      return errorResponse(res, 404, "کاربر یافت نشد");
    }

    return successResponse(res, 200, "نقش با موفقیت حذف شد", {
      roles: updatedUser.roles,
    });
  } catch (err) {
    next(err);
  }
};
