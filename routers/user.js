const express = require("express");
const authMiddleware = require("../middlewares/authJsonWebToken");
const { isUpdateValidators } = require("../middlewares/user");
const validateObjectId = require("../middlewares/ObjectID");
const isRoleGuardMiddleware = require("../middlewares/roleGuard");
const {banUser} = require("../controllers/user");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/ban/:id",
  isRoleGuardMiddleware(["SUPER_ADMIN", "SUPPORT"]),
  validateObjectId,
  banUser
);

module.exports = router;
