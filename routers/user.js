const express = require("express");
const authMiddleware = require("../middlewares/authJsonWebToken");
const { isUpdateValidators } = require("../middlewares/user");
const validateObjectId = require("../middlewares/ObjectID");
const isRoleGuardMiddleware = require("../middlewares/roleGuard");
const {
  banUser,
  getAllUsers,
  updateUser,
  deactivateMe,
  removeUser,
  addRole,
  removeRole
} = require("../controllers/user");

const { uploadProfile } = require("../utils/uploader");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/ban/:id",
  isRoleGuardMiddleware(["SUPER_ADMIN", "SUPPORT"]),
  validateObjectId,
  banUser
);

router
  .route("/")
  .get(isRoleGuardMiddleware(["SUPER_ADMIN"]), getAllUsers)
  .put(isUpdateValidators,uploadProfile, updateUser)
  .delete(deactivateMe);

router.delete(
  "/:id",
  isRoleGuardMiddleware(["SUPER_ADMIN"]),
  validateObjectId,
  removeUser
);

router.put(
  "/add-role/:id",
  isRoleGuardMiddleware(["SUPER_ADMIN"]),
  validateObjectId,
  addRole
);

router.delete(
  "/remove-role/:id",
  isRoleGuardMiddleware(["SUPER_ADMIN"]),
  validateObjectId,
  removeRole
);

module.exports = router;
