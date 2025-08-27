const mongoose = require("mongoose");
const moment = require("moment-jalaali");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    type: [String],
    required: true,
    enum: [
      "USER",
      "SUPER_ADMIN",
      "CONSULTANT",
      "FINANCIAL",
      "SUPPORT",
      "TEACHER",
    ],
    default: ["USER"],
  },
  accepted: { type: Boolean, required: true, default: true },
  createdAt: {
    type: String,
    default: () => moment().format("jYYYY/jMM/jDD HH:mm"),
  },
  updatedAt: {
    type: String,
    default: () => moment().format("jYYYY/jMM/jDD HH:mm"),
  },
});

userSchema.pre("save", function (next) {
  this.updatedAt = moment().format("jYYYY/jMM/jDD HH:mm");
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: moment().format("jYYYY/jMM/jDD HH:mm") });
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
