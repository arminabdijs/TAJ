const mongoose = require("mongoose");
const moment = require("moment-jalaali");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
    unique: true,
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

categorySchema.pre("save", function (next) {
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: moment().format("jYYYY/jMM/jDD") });
  next();
});

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
