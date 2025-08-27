const userModel = require("../models/User");

const checkDuplicateUser = async (email, username, userId) => {
  const conditions = [];
  if (email) conditions.push({ email });
  if (username) conditions.push({ username });

  if (conditions.length === 0) return;

  const existingUser = await userModel.findOne({
    $or: conditions,
    _id: { $ne: userId },
  });

  if (existingUser) {
    const error = new Error("ایمیل یا نام کاربری قبلاً استفاده شده است");
    error.statusCode = 409; 
    throw error;
  }
};

module.exports = checkDuplicateUser;
