const mongoose =require("mongoose");
const moment = require("moment-jalaali");


const replySchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

replySchema.pre("save", function (next) {
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
  next();
});

replySchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: moment().format("jYYYY/jMM/jDD") });
  next();
});

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isAccepted: {
        type: Boolean,
        default: false,
    },
    score:{
        type: Number,
        min:1,
        max:5,
        default: 5,
    },
    isAnswered: {
        type: Boolean,
        default: false,
    },
    mainCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    replies: [replySchema],
  createdAt: {
    type: String,
    default: () => moment().format("jYYYY/jMM/jDD"),
  },
  updatedAt: {
    type: String,
    default: () => moment().format("jYYYY/jMM/jDD"),
  },
})

commentSchema.pre("save", function (next) {
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
  next();
});

commentSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: moment().format("jYYYY/jMM/jDD") });
  next();
});

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;