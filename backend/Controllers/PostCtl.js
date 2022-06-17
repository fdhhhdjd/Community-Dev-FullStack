const Post = require("../Models/PostModel");
const User = require("../Models/UserModel");
const mongoose = require("mongoose");
const tagCtrl = require("../Controllers/TagCtl");
const { validationResult } = require("express-validator");
const { createTags, updateTags } = require("../Controllers/TagCtl");

const postCtrl = {
  createPost: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: "400",
        msg: "Invalid inputs passed, please try again!",
      });
    }
    const { title, body, tags, titleURL, author, image } = req.body;
    const createdPost = await Post.create({
      title,
      image,
      body,
      titleURL,
      author,
    });
    tags_string = JSON.stringify(tags);
    await createTags(JSON.parse(tags_string), createdPost);
    let user;
    try {
      user = await User.findById(author); //check if the user ID exists
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Creating post failed, please try again",
      });
    }
    if (!user) {
      return res.json({
        status: 400,
        msg: "Could not find user for provided ID",
      });
    }
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction(); //start transaction
      await createdPost.save({ session: sess }); //save new doc with the new post
      user.posts.push(createdPost); //add post id to the corresponding user
      //(BTS: MongoDB grabs just the post id and adds it to the "posts" array in the "user" doc)
      await user.save({ session: sess }); //save the updated user (part of our current session)
      await sess.commitTransaction(); //session commits the transaction
    } catch (err) {
      return next(new HttpError("Creating post failed, please try again", 500));
    }
    res.status(201).json({
      msg: "Create Post Successful!!",
      post: createdPost.populate("author").toObject({ getters: true }),
    });
  },
  getPostsByUserId: async (req, res) => {
    const { userId } = req.params;
    let posts;
    try {
      posts = await Post.find({ author: userId }).populate("author");
    } catch (eror) {
      return res.json({
        status: 500,
        msg: "Fetching posts failed. Please try again",
      });
    }
    if (!posts || posts.length === 0) {
      return res.json({
        status: 400,
        msg: "Could not find posts for the user ID",
      });
    }
    res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
  },
};
module.exports = postCtrl;
