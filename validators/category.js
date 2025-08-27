const Joi = require("joi");


const sanitizeCategory = (data) => {
  const sanitized = { ...data };

  if (sanitized.title && typeof sanitized.title === "string") {
    sanitized.title = sanitized.title.trim();
  }

  if (sanitized.href && typeof sanitized.href === "string") {
    sanitized.href = sanitized.href.trim().toLowerCase();
  }

  return sanitized;
};


const registerCategorySchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    "string.base": "عنوان باید یک رشته باشد.",
    "string.empty": "فیلد «عنوان» نمی‌تواند خالی باشد.",
    "string.min": "عنوان باید حداقل ۳ کاراکتر باشد.",
    "string.max": "عنوان نباید بیشتر از ۲۵۵ کاراکتر باشد.",
    "any.required": "فیلد «عنوان» الزامی است.",
  }),

  href: Joi.string().min(3).max(100).pattern(/^[a-z0-9-]+$/i).required().messages({
    "string.base": "آدرس باید یک رشته باشد.",
    "string.empty": "فیلد «آدرس» نمی‌تواند خالی باشد.",
    "string.min": "آدرس باید حداقل ۳ کاراکتر باشد.",
    "string.max": "آدرس نباید بیشتر از ۱۰۰ کاراکتر باشد.",
    "string.pattern.base": "آدرس فقط می‌تواند شامل حروف، اعداد و خط تیره باشد.",
    "any.required": "فیلد «آدرس» الزامی است.",
  }),
});


const updateCategorySchema = Joi.object({
  title: Joi.string().min(3).max(255).optional().messages({
    "string.base": "عنوان باید یک رشته باشد.",
    "string.min": "عنوان باید حداقل ۳ کاراکتر باشد.",
    "string.max": "عنوان نباید بیشتر از ۲۵۵ کاراکتر باشد.",
  }),

  href: Joi.string().min(3).max(100).pattern(/^[a-z0-9-]+$/i).optional().messages({
    "string.base": "آدرس باید یک رشته باشد.",
    "string.min": "آدرس باید حداقل ۳ کاراکتر باشد.",
    "string.max": "آدرس نباید بیشتر از ۱۰۰ کاراکتر باشد.",
    "string.pattern.base": "آدرس فقط می‌تواند شامل حروف، اعداد و خط تیره باشد.",
  }),
});


const validateCategory = (data, schema) => {
  const cleaned = sanitizeCategory(data);
  const { error, value } = schema.validate(cleaned, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    value,
  };
};


module.exports = {
  validateRegisterCategory: (data) => validateCategory(data, registerCategorySchema),
  validateUpdateCategory: (data) => validateCategory(data, updateCategorySchema),
};
