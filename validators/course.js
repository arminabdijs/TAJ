const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

const sanitize = (data) => {
  const cleaned = { ...data };
  if (cleaned.name && typeof cleaned.name === "string") cleaned.name = cleaned.name.trim();
  if (cleaned.description && typeof cleaned.description === "string") cleaned.description = cleaned.description.trim();
  if (cleaned.href && typeof cleaned.href === "string") cleaned.href = cleaned.href.trim();
  if (cleaned.status && typeof cleaned.status === "string") cleaned.status = cleaned.status.trim();
  if (cleaned.categoryId && typeof cleaned.categoryId === "string") cleaned.categoryId = cleaned.categoryId.trim();
 
  return cleaned;
};

const createSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.base": "نام باید رشته باشد.",
    "string.empty": "نام نمی‌تواند خالی باشد.",
    "string.min": "نام باید حداقل ۳ کاراکتر باشد.",
    "string.max": "نام نمی‌تواند بیش از ۲۵۵ کاراکتر باشد.",
    "any.required": "نام الزامی است.",
  }),
  description: Joi.string().trim().required().messages({
    "string.base": "توضیحات باید رشته باشد.",
    "string.empty": "توضیحات نمی‌تواند خالی باشد.",
    "any.required": "توضیحات الزامی است.",
  }),
  href: Joi.string().trim().required().messages({
    "string.base": "لینک باید رشته باشد.",
    "string.empty": "لینک نمی‌تواند خالی باشد.",
    "any.required": "لینک الزامی است.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "قیمت باید عدد باشد.",
    "number.min": "قیمت نمی‌تواند منفی باشد.",
    "any.required": "قیمت الزامی است.",
  }),
  status: Joi.string().valid("درحال برگزاری", "تمام شده", "درحال پیش فروش").trim().required().messages({
    "any.only": "وضعیت باید یکی از موارد «درحال برگزاری»، «تمام شده» یا «درحال پیش فروش» باشد.",
    "string.empty": "وضعیت نمی‌تواند خالی باشد.",
    "any.required": "وضعیت الزامی است.",
  }),
  discount: Joi.number().min(0).max(100).required().messages({
    "number.base": "تخفیف باید عدد باشد.",
    "number.min": "تخفیف نمی‌تواند منفی باشد.",
    "number.max": "تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.",
    "any.required": "تخفیف الزامی است.",
  }),
  categoryId: JoiObjectId().required().messages({
    "any.required": "شناسه دسته‌بندی الزامی است.",
    "string.pattern.name": "شناسه دسته‌بندی باید یک ObjectId معتبر باشد.",
  }),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(255).messages({
    "string.base": "نام باید رشته باشد.",
    "string.min": "نام باید حداقل ۳ کاراکتر باشد.",
    "string.max": "نام نمی‌تواند بیش از ۲۵۵ کاراکتر باشد.",
  }),
  description: Joi.string().trim().messages({
    "string.base": "توضیحات باید رشته باشد.",
  }),
  href: Joi.string().trim().messages({
    "string.base": "لینک باید رشته باشد.",
  }),
  price: Joi.number().min(0).messages({
    "number.base": "قیمت باید عدد باشد.",
    "number.min": "قیمت نمی‌تواند منفی باشد.",
  }),
  status: Joi.string().valid("درحال برگزاری", "تمام شده", "درحال پیش فروش").trim().messages({
    "any.only": "وضعیت باید یکی از موارد «درحال برگزاری»، «تمام شده» یا «درحال پیش فروش» باشد.",
  }),
  discount: Joi.number().min(0).max(100).messages({
    "number.base": "تخفیف باید عدد باشد.",
    "number.min": "تخفیف نمی‌تواند منفی باشد.",
    "number.max": "تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.",
  }),
  categoryId: JoiObjectId().messages({
    "string.pattern.name": "شناسه دسته‌بندی باید یک ObjectId معتبر باشد.",
  }),
}).min(1);

const createSessionSchema = Joi.object({
  title: Joi.string().min(3).max(255).trim().required().messages({
    "string.base": "عنوان باید رشته باشد.",
    "string.empty": "عنوان نمی‌تواند خالی باشد.",
    "string.min": "عنوان باید حداقل ۳ کاراکتر داشته باشد.",
    "string.max": "عنوان نمی‌تواند بیش از ۲۵۵ کاراکتر باشد.",
    "any.required": "عنوان الزامی است.",
  }),
  time: Joi.string().trim().required().messages({
    "string.base": "زمان باید رشته باشد.",
    "string.empty": "زمان نمی‌تواند خالی باشد.",
    "any.required": "زمان الزامی است.",
  }),
  free: Joi.boolean().required().messages({
    "boolean.base": "فیلد رایگان باید مقدار true یا false باشد.",
    "any.required": "فیلد رایگان الزامی است.",
  }),
  keywords: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()),
      Joi.string().custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed) || !parsed.every((v) => typeof v === "string")) {
            throw new Error();
          }
          return parsed;
        } catch {
          return helpers.error("any.invalid");
        }
      })
    )
    .messages({
      "array.base": "کلمات کلیدی باید آرایه‌ای از رشته‌ها باشند.",
      "any.invalid": "کلمات کلیدی باید به صورت آرایه‌ای از رشته‌ها (در قالب JSON) باشند.",
    }),
});


const formatJoiErrors = (error) => {
  return error.details.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
};

const validateCreate = (data) => {
  const cleaned = sanitize(data);
  const result = createSchema.validate(cleaned, { abortEarly: false });
  return result.error ? formatJoiErrors(result.error) : true;
};

const validateUpdate = (data) => {
  const cleaned = sanitize(data);
  const result = updateSchema.validate(cleaned, { abortEarly: false });
  return result.error ? formatJoiErrors(result.error) : true;
};

const validateCreateSession = (data) => {
  const cleaned = sanitize(data);
  const result = createSessionSchema.validate(cleaned, { abortEarly: false });
  return result.error ? formatJoiErrors(result.error) : true;
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateCreateSession,
};
