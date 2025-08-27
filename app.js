const express = require("express");


const { setHeaders } = require("./middlewares/headers");
const { errorHandler } = require("./middlewares/errorHandler");

const authRouter = require("./routers/auth");
const usersRouter = require("./routers/user");
const categoryRouter =require("./routers/category")
const coursesRouter =require("./routers/course")


const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً بعداً تلاش کنید.",
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(limiter);

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res
    .status(500)
    .json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
});


app.use("/api/auth",authRouter );
app.use("/api/users",usersRouter );
app.use("/api/category",categoryRouter );
app.use("/api/courses",coursesRouter );



app.use((req, res) => {
  console.log("This path is not found: ", req.path);

  return res.status(404).json({
    message: "😀 اوه! چنین آدرسی پیدا نشد. مطمئنی درست اومدی؟",
  });
});


app.use(errorHandler)

module.exports = app;
