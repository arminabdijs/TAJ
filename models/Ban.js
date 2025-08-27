const mongoose = require("mongoose");
const moment = require("moment-jalaali");

const banUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
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

banUserSchema.pre("save", function (next) {
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
  next();
});

banUserSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: moment().format("jYYYY/jMM/jDD") });
  next();
});

const banUserModel = mongoose.model("banUser", banUserSchema);

module.exports = banUserModel;
