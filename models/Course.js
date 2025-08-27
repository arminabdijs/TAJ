const mongoose = require("mongoose");
const moment = require("moment-jalaali");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cover: {
      type: String,
      required: true,
      trim: true,
    },
    href: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "درحال برگزاری",
        "تمام شده",
        "درحال پیش فروش"
        
      ],
      trim: true,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  createdAt: {
    type: String,
    default: () => moment().format("jYYYY/jMM/jDD"),
  },
  updatedAt: {
    type: String,
    default: () => moment().format("jYYYY/jMM/jDD"),
  },
}
);

courseSchema.pre("save", function (next) {
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
  next();
});

courseSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: moment().format("jYYYY/jMM/jDD") });
  next();
});

courseSchema.virtual("sessions", {
  ref: "Session",
  localField: "_id",
  foreignField: "course",
});

courseSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "course",
});

const courseModel = mongoose.model("Course", courseSchema);

module.exports = courseModel;
