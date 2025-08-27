const express = require("express");
const authMiddleware = require("../middlewares/authJsonWebToken");
const isRoleGuardMiddleware = require("../middlewares/roleGuard");
const validateObjectId = require("../middlewares/ObjectID");
const {
  isRegisterCategoryValidators,
  isUpdateCategoryValidators,
} = require("../middlewares/category");
const { createCategory, getAllCategories,removeCategory, updateCategory} = require("../controllers/category");

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .post(
    isRoleGuardMiddleware(["SUPER_ADMIN", "SUPPORT"]),
    isRegisterCategoryValidators,
    createCategory
  )
  .get(getAllCategories);

router
  .route("/:id")
  .delete(
    isRoleGuardMiddleware(["SUPER_ADMIN"]),
    validateObjectId,
    removeCategory
  )
  .put(
    isRoleGuardMiddleware(["SUPER_ADMIN"]),
    validateObjectId,
    isUpdateCategoryValidators,
    updateCategory
  );

  
module.exports = router;
