const Joi = require("joi");

const sanitize = (data) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) =>
      [key, typeof value === "string" ? value.trim() : value]
    )
  );
};

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(100).required().messages({
    "string.base": "فیلد 'username' باید متن باشد.",
    "string.empty": "فیلد 'username' الزامی است.",
    "string.min": "طول فیلد 'username' حداقل ۳ کاراکتر باشد.",
    "string.max": "طول فیلد 'username' حداکثر ۱۰۰ کاراکتر باشد.",
  }),
  email: Joi.string().email().min(10).max(100).required().messages({
    "string.email": "فرمت 'email' نامعتبر است.",
    "string.empty": "فیلد 'email' الزامی است.",
  }),
  password: Joi.string().min(8).max(24).required().messages({
    "string.empty": "فیلد 'password' الزامی است.",
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    "any.only": "فیلد 'confirmPassword' باید با 'password' برابر باشد.",
  }),
}).strict(true);

const updateSchema = Joi.object({
  username: Joi.string().min(3).max(100).messages({
    "string.base": "فیلد 'username' باید متن باشد.",
  }),

  profile: Joi.string().messages({
    "string.base": "فیلد 'profile' باید متن (مسیر عکس) باشد.",
  }),

  password: Joi.string().min(8).max(24).messages({
    "string.min": "طول 'password' حداقل ۸ کاراکتر باشد.",
    "string.max": "طول 'password' حداکثر ۲۴ کاراکتر باشد.",
  }),
}).strict(true);



const formatErrors = (error) =>
  error.details.map(e => ({ field: e.path.join("."), message: e.message }));


const validate = (schema, data) => {
  const result = schema.validate(sanitize(data), { abortEarly: false });
  return result.error ? formatErrors(result.error) : true;
};


module.exports = {
  validateRegister: (data) => validate(registerSchema, data),
  validateUpdate: (data) => validate(updateSchema, data),
};
