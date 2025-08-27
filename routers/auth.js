const express = require("express");
const {register,login,logout,getMe}=require("../controllers/auth")
const authMiddleware = require("../middlewares/authJsonWebToken");
const { isRegisterValidators } = require("../middlewares/user");


const router = express.Router();


router.post("/register", isRegisterValidators, register);

router.post("/login", login);

router.post("/logout",authMiddleware, logout);

router.get("/me",authMiddleware, getMe);

module.exports = router;