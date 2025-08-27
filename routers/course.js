const express = require("express");
const authMiddleware = require("../middlewares/authJsonWebToken");
const isObjectId = require("../middlewares/ObjectID");
const isRoleGuardMiddleware = require("../middlewares/roleGuard");
const {
  createCourse,
  getAllCourses,
  deleteCourse,
  updateCourse,
  getPopularCourses,
  getPresellCourses
} = require("../controllers/course");
const { uploadCover, uploadVideo } = require("../utils/uploader");
const {
  isValidateCreateCourse,
  isValidateUpdateCourse,
  isValidateCreateSession,
} = require("../middlewares/course");

const router = express.Router();

// router.get("/popular", getPopularCourses);
// router.get("/presell", getPresellCourses);
// router.get("/:href", getOneCourses);
router.get("/", getAllCourses);

router.use(authMiddleware);

router.post(
  "/",
  isRoleGuardMiddleware(["SUPER_ADMIN", "TEACHER"]),
  uploadCover,
  isValidateCreateCourse,
  createCourse
);

router
  .route("/:id")
  .delete(isRoleGuardMiddleware(["SUPER_ADMIN"]), isObjectId, deleteCourse)
  .put(
    isRoleGuardMiddleware(["SUPER_ADMIN", "TEACHER"]),
    uploadCover,
    isValidateUpdateCourse,
    isObjectId,
    updateCourse
  );

module.exports = router;
