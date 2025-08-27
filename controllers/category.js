const categoryModel = require("../models/Category");
const { errorResponse, successResponse } = require("../helpers/responses");

exports.createCategory = async (req, res, next) => {
  try {
    const { title, href } = req.body;

    const isCategoryExist = await categoryModel.findOne({
      $or: [{ title }, { href }],
    });

    if (isCategoryExist) {
      return errorResponse(
        res,
        409,
        "دسته‌بندی با این عنوان یا لینک قبلاً ثبت شده است."
      );
    }

    const category = await categoryModel.create({ title, href });

    return successResponse(res, 201, {
      message: "دسته‌بندی با موفقیت ایجاد شد.",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel
      .find({}, "-__v")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, {
      message: "دسته‌بندی‌ها با موفقیت دریافت شدند.",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return errorResponse(res, 404, "دسته‌بندی پیدا نشد.");
    }

    return successResponse(res, 200, "دسته‌بندی با موفقیت حذف شد.");
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { title, href } = req.body;

  try {
    const category = await categoryModel.findById(id);

    if (!category) {
      return errorResponse(res, 404, "دسته‌بندی پیدا نشد.");
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { title, href },
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, {
      message: "دسته‌بندی با موفقیت ویرایش شد.",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};
