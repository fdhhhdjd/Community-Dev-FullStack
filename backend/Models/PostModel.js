const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tags: [{ type: mongoose.Types.ObjectId, required: true, ref: "Tag" }],
  date: { type: Date, default: Date.now },
  titleURL: {
    type: String,
    required: true,
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  bookmarks: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  unicorns: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Types.ObjectId, required: true, ref: "Comment" }],
  author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Post", postSchema);
