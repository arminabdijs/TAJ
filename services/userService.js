const userModel = require("../models/User");
const buildUpdateData = require("../utils/buildUpdateData");
const checkDuplicateUser = require("../utils/checkDuplicateUser");

exports.updateUserService = async (userId, body, file) => {
  const { email, username } = body;

  await checkDuplicateUser(email, username, userId);

  const updateData = await buildUpdateData(body, file);

  const updatedUser = await userModel
    .findByIdAndUpdate(userId, updateData, { new: true })
    .select("-password")
    .lean();

  if (!updatedUser) {
    const error = new Error("کاربر یافت نشد");
    error.statusCode = 404;
    throw error;
  }

  return updatedUser;
};
