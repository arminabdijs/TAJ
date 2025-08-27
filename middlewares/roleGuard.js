const { errorResponse } = require("../helpers/responses");

module.exports = (roles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return errorResponse(res, 401, "احراز هویت انجام نشده است.");
      }

      const userRoles = (user.roles || []).map(r => r.toUpperCase());
      const requiredRoles = (Array.isArray(roles) ? roles : [roles]).map(r => r.toUpperCase());

      if (!userRoles.length) {
        return errorResponse(res, 403, "شما هیچ نقشی ندارید. دسترسی غیرمجاز.");
      }

      const hasAccess = requiredRoles.some(role => userRoles.includes(role));

      if (!hasAccess) {
        return errorResponse(res, 403, "شما به این مسیر دسترسی ندارید.");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
