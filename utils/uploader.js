const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");

const UPLOAD_DIR = {
  covers: path.join(__dirname, "..", "public", "courses", "covers"),
  videos: path.join(__dirname, "..", "public", "courses", "videos"),
  profiles: path.join(__dirname, "..", "public", "profiles"),
};

const LIMITS = {
  cover: 8 * 1024 * 1024, // 8MB
  video: 500 * 1024 * 1024, // 500MB
  profile: 5 * 1024 * 1024, // 5MB
};

const ALLOWED_TYPES = {
  cover: ["image/jpeg", "image/png", "image/jpg"],
  video: ["video/mp4", "video/webm", "video/ogg"],
  profile: ["image/jpeg", "image/png", "image/jpg"],
};

function generateUniqueFilename(originalName) {
  const hash = crypto
    .createHash("sha256")
    .update(originalName + Date.now())
    .digest("hex");
  return `${hash}${path.extname(originalName)}`;
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}


function createStorage(destinationPath) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      ensureDirectoryExists(destinationPath);
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      cb(null, generateUniqueFilename(file.originalname));
    },
  });
}


function createFileFilter(allowedTypes, errorMessage) {
  return (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      const err = new Error(errorMessage);
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  };
}


const uploadCover = multer({
  storage: createStorage(UPLOAD_DIR.covers),
  limits: { fileSize: LIMITS.cover },
  fileFilter: createFileFilter(
    ALLOWED_TYPES.cover,
    "فرمت فایل معتبر نیست. فقط JPEG، PNG و JPG مجاز هستند."
  ),
}).single("cover");


const uploadVideo = multer({
  storage: createStorage(UPLOAD_DIR.videos),
  limits: { fileSize: LIMITS.video },
  fileFilter: createFileFilter(
    ALLOWED_TYPES.video,
    "فرمت فایل معتبر نیست. فقط MP4، WebM و OGG مجاز هستند."
  ),
}).single("video");


const uploadProfile = multer({
  storage: createStorage(UPLOAD_DIR.profiles),
  limits: { fileSize: LIMITS.profile },
  fileFilter: createFileFilter(
    ALLOWED_TYPES.profile,
    "فرمت فایل معتبر نیست. فقط JPEG، PNG و JPG مجاز هستند."
  ),
}).single("profile");

module.exports = {
  uploadCover,
  uploadVideo,
  uploadProfile,
};
