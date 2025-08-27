const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const courseModel = require("../models/Course");
const categoryModel = require("../models/Category");
const { errorResponse, successResponse } = require("../helpers/responses");
const createPaginationData = require("../utils/pagination");
const sessionModel = require("../models/Session");
const commentModel = require("../models/Comment");

exports.createCourse = async (req, res, next) => {
  try {
    const { name, description, href, price, status, discount, categoryId } =
      req.body;

      if (!req.file) {
      return errorResponse(res, 400, "تصویر دوره الزامی است");
    }

     const coverName = req.file.filename;
    const deleteCover = async (filename) => {
      const filePath = path.join("public", "courses", "covers", filename);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("خطا در حذف تصویر:", err.message);
      }
    };

      const trimmedName = name?.trim();
    const trimmedHref = href?.trim();

    const isExist = await courseModel.findOne({
      $or: [{ name: trimmedName }, { href: trimmedHref }],
    });

    if (isExist) {
      await deleteCover(coverName);
      return errorResponse(res, 400, "دوره‌ای با همین نام یا آدرس وجود دارد");
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      await deleteCover(coverName);
      return errorResponse(res, 400, "شناسه دسته‌بندی نامعتبر است");
    }

    const isExistCategory = await categoryModel.findById(categoryId);
    if (!isExistCategory) {
      await deleteCover(coverName);
      return errorResponse(res, 400, "دسته بندی مورد نظر یافت نشد");
    }

    const newCourse = await courseModel.create({
      name: trimmedName,
      description,
      href: trimmedHref,
      price,
      status,
      discount,
      cover: coverName,
      categoryId: new mongoose.Types.ObjectId(categoryId),
      creator: req.user._id,
    });

    const mainCourse = await courseModel
      .findById(newCourse._id)
      .populate("creator", "-password -__v")
      .populate("categoryId", "-__v")
      .select("-__v");

    return successResponse(res, 201, "دوره با موفقیت ایجاد شد", mainCourse);
  } catch (e) {
    next(e);
  }
};




exports.getAllCourses = async (req, res, next) => {
  try {
    const { name, categoryId, minPrice, maxPrice } = req.query;

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 10 : limit;

    const filters = {};

    if (name) filters.name = { $regex: name, $options: "i" };
    if (categoryId)
      filters.categoryId = new mongoose.Types.ObjectId(categoryId);
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = +minPrice;
      if (maxPrice) filters.price.$lte = +maxPrice;
    }

    const courses = await courseModel.aggregate([
      { $match: filters },
      { $skip: (page - 1) * limit },
      { $sort: { studentsCount: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);

    const totalCourse = await courseModel.countDocuments(filters);

    return successResponse(res, 200, {
      courses,
      pagination: createPaginationData(page, limit, totalCourse, "دوره ها"),
    });
  } catch (err) {
    next(err);
  }
};



exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await courseModel.findById(id);
    if (!course) {
      return errorResponse(res, 404, "دوره یافت نشد");
    }

    if (course.cover) {
      const coverPath = path.join("public", "courses", "covers", course.cover);
      try {
        await fs.unlink(coverPath);
      } catch (err) {
        console.error("خطا در حذف تصویر کاور:", err.message);
      }
    }

    await sessionModel.deleteMany({ course: id });

    await courseModel.findByIdAndDelete(id);

    await commentModel.deleteMany({ course: id });

    return successResponse(res, 200, "دوره با موفقیت حذف شد");
  } catch (err) {
    next(err);
  }
};



exports.updateCourse = async (req, res, next) => {
  try {
    const { description, price, status, discount } = req.body;
    const { id } = req.params;

    const course = await courseModel.findById(id);
    if (!course) {
      return errorResponse(res, 404, "دوره مورد نظر یافت نشد");
    }

    if (description !== undefined) course.description = description;
    if (price !== undefined) course.price = price;
    if (status !== undefined) course.status = status;
    if (discount !== undefined) course.discount = discount;

    if (req.file?.filename) {
      const newCover = req.file.filename;

      if (course.cover) {
        const oldCoverPath = path.join(
          "public",
          "courses",
          "covers",
          course.cover
        );
        try {
          await fs.unlink(oldCoverPath);
        } catch (err) {
          console.error("خطا در حذف کاور قبلی:", err.message);
        }
      }

      course.cover = newCover;
    }

    await course.save();

    return successResponse(res, 200, "دوره با موفقیت به‌روزرسانی شد", course);
  } catch (err) {
    next(err);
  }
};