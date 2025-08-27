const mongoose = require("mongoose");
const moment = require("moment-jalaali");

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  free: { type: Boolean, required: true, default: true },
  video: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  keywords: {
    type: [String],
    default: [],
    validate: {
      validator: (value) =>
        Array.isArray(value) && value.every((item) => typeof item === "string"),
      message: "کلمات کلیدی باید آرایه‌ای از رشته‌ها باشند.",
    },
  },
  createdAt: {
    type: String,
    default: () => moment().format("jYYYY/jMM/jDD"),
  },
  updatedAt: {
    type: String,
    default: () => moment().format("jYYYY/jMM/jDD"),
  },
});

sessionSchema.pre("save", function (next) {
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
  next();
});

sessionSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: moment().format("jYYYY/jMM/jDD") });
  next();
});

const sessionModel = mongoose.model("Session", sessionSchema);

module.exports = sessionModel;
