const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  parentPost: { type: mongoose.Types.ObjectId, required: true, ref: "Post" },
  parentId: { type: mongoose.Types.ObjectId, ref: "Comment", default: null },
  author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  likes: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
});

module.exports = mongoose.model("Comment", commentSchema);
