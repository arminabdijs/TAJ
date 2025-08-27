const userModel = require("../models/User");
const banUserModel = require("../models/Ban");
const BlacklistToken = require("../models/BlacklistToken");
const moment = require("moment-jalaali");
const { errorResponse, successResponse } = require("../helpers/responses");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

const removePassword = (user) => {
  const userObject =
    typeof user.toObject === "function" ? user.toObject() : { ...user };
  Reflect.deleteProperty(userObject, "password");
  return userObject;
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const isBanned = await banUserModel.findOne({ email });

    if (isBanned) {
      return errorResponse(res, 403, "این شماره ایمیل مسدود شده است.");
    }

    const hasUser = await userModel.findOne({
      username,
      email,
      accepted: false,
    });

    if (hasUser) {
      await userModel.findByIdAndUpdate(hasUser._id, {
        accepted: true,
        password: hashedPassword,
      });

      const accessToken = generateToken(hasUser._id);
      return successResponse(res, 200, "کاربر با موفقیت فعال شد", {
        accessToken,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isUserExist = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserExist) {
      return errorResponse(res, 409, "نام کاربری یا ایمیل قبلاً ثبت شده است.");
    }

    const isFirstUser = (await userModel.countDocuments()) === 0;

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      roles: isFirstUser ? ["SUPER_ADMIN"] : ["USER"],
      accepted: true,
    });

    const accessToken = generateToken(newUser._id);

    return successResponse(res, 201, "ثبت‌نام با موفقیت انجام شد", {
      user: removePassword(newUser),
      accessToken,
    });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const user = await userModel
      .findOne({
        $or: [{ email: identifier }, { username: identifier }],
      })
      .select("+password");

    if (!user) {
      return errorResponse(res, 401, "کاربری با این مشخصات یافت نشد.");
    }

    const isBanned = await banUserModel.findOne({ email: user.email });

    if (isBanned) {
      return errorResponse(res, 403, "این کاربر مسدود شده است.");
    }

    if (!user.accepted) {
      return errorResponse(res, 403, "دسترسی کاربر هنوز تأیید نشده است.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 401, "رمز عبور نادرست است.");
    }

    const accessToken = generateToken(user._id);
    return successResponse(res, 200, "ورود با موفقیت انجام شد", {
      user: removePassword(user),
      accessToken,
    });
  } catch (e) {
    console.error("Login Error:", e);
    next(e);
  }
};

exports.logout = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse(res, 401, "توکن ارسال نشده است");
  }

  const token = authHeader.split(" ")[1];

  try {
    const blacklisted = await BlacklistToken.findOne({ token });

    if (blacklisted) {
      return errorResponse(
        res,
        401,
        "توکن قبلاً باطل شده است. لطفاً دوباره وارد شوید."
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await BlacklistToken.create({
      token,
      expiredAt: moment(decoded.exp*1000).format("jYYYY/jMM/jDD HH:mm:ss"),
    });

    return successResponse(res, 200, "با موفقیت خارج شدید");
  } catch {
    return errorResponse(res, 401, "توکن نامعتبر یا منقضی شده است");
  }
};

exports.getMe = async (req, res, next) => {
  try {
    return successResponse(res, 200, "اطلاعات کاربر با موفقیت دریافت شد", removePassword(req.user));
  } catch (err) {
    next(err);
  }
};
