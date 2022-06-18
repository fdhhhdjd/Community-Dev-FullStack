const Post = require("../Models/PostModel");
const User = require("../Models/UserModel");
const mongoose = require("mongoose");
const tagCtrl = require("../Controllers/TagCtl");
const { validationResult } = require("express-validator");
const { createTags, updateTags } = require("../Controllers/TagCtl");
const {
  likeNotification,
  removeLikeNotification,
} = require("../Controllers/NotifucationCtl");
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
    return res.status(201).json({
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
    return res.json({
      posts: posts.map((post) => post.toObject({ getters: true })),
    });
  },
  getPostId: async (req, res) => {
    const { postId } = req.params;

    let post;
    try {
      post = await Post.findById(postId)
        .populate("author")
        // .populate("comments")
        .populate("tags");
      //findById works directly on the contructor fn
    } catch (err) {
      //stop execution in case of error
      return res.json({
        status: 500,
        msg: "Something went wrong with the server",
      });
    }
    if (!post) {
      return res.json({
        status: 400,
        msg: "Could not find post for the provided ID",
      });
    }

    return res.json({ post: post.toObject({ getters: true }) });
  },
  getAllPost: async (req, res, next) => {
    let posts;
    try {
      posts = await Post.find()
        .sort({ date: "desc" })
        .populate("author")
        .populate("tags");
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Could not fetch posts, please try again",
      });
    }
    return res.status(200).json({
      status: 200,
      msg: "Get All Product Successfully!",
      posts: posts.map((post) => post.toObject({ getters: true })),
    });
  },
  getSearchResults: async (req, res, next) => {
    const query = {};
    if (req.query.search) {
      const options = "$options";
      query.title = { $regex: req.query.search, [options]: "i" };
      let posts;
      try {
        posts = await Post.find(query)
          .sort({ date: "desc" })
          .populate("author")
          .populate("tags");
      } catch (err) {
        return res.json({
          status: 500,
          msg: "Search failed, please try again",
        });
      }
      return res.status(200).json({
        status: 200,
        msg: "Search Successful!!",
        posts: posts.map((post) => post.toObject({ getters: true })),
      });
    }
  },
  updatePost: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: 400,
        msg: "Invalid inputs passed, please try again!",
      });
    }
    const { postId } = req.params;
    let post;
    try {
      post = await Post.findById(postId).populate("tags");
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Could not update post, please try again!",
      });
    }
    if (post.author.toString() !== req.body.author) {
      return res.json({
        status: 400,
        msg: "You are not allowed to update the post !",
      });
    }
    Object.keys(req.body).map((key) => {
      if (key !== "tags") post[key] = req.body[key];
    });
    tags_string = JSON.stringify(req.body.tags);
    await updateTags(JSON.parse(tags_string), post);
    try {
      await post.save();
      return res.status(200).json({
        status: 200,
        msg: "update Post Successful!",
        post: post.toObject({ getters: true }),
      });
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Could not update post !",
      });
    }
  },
  deletePost: async (req, res, next) => {
    const { postId } = req.params;
    const { author } = req.body;
    let post;
    try {
      post = await Post.findById(postId).populate("author");
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Could not delete post.",
      });
    }
    if (!post) {
      return res.json({
        status: 400,
        msg: "Could not find post for the provided ID.",
      });
    }
    if (post.author.id !== author) {
      return res.json({
        status: 400,
        msg: "You are not allowed to delete the post",
      });
    }

    try {
      const sess = await mongoose.startSession(); //start session
      sess.startTransaction(); //start transaction
      await post.remove({ session: sess }); //remove doc; make sure we refer to the current session
      post.author.posts.pull(post); //remove post id from the corresponding user
      await post.author.save({ session: sess }); //save the updated user (part of our current session)
      await sess.commitTransaction(); //session commits the transaction
      //only at this point, the changes are saved in DB... anything goes wrong, EVERYTHING is undone by MongoDB
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Deleting post failed, please try again",
      });
    }
    return res.status(201).json({
      status: 200,
      msg: "Deleted post Success !",
    });
  },
  likePost: async (req, res, next) => {
    const { postId, userId } = req.body;
    let post;
    try {
      post = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
      const authorId = post.author.toString();
      if (authorId !== userId) {
        await likeNotification(userId, postId, authorId, next);
      }
    } catch (error) {
      return res.json({ status: 500, msg: "Like failed!" });
    }
    return res.status(200).json({
      status: 200,
      msg: "Like Success",
      post: post.toObject({ getters: true }),
    });
  },
  unlikePost: async (req, res, next) => {
    const { postId, userId } = req.body;
    let post;
    try {
      post = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
      const authorId = post.author.toString();

      if (authorId !== userId) {
        await removeLikeNotification(userId, postId, authorId, next);
      }
    } catch (err) {
      return res.json({ status: 500, msg: "Unlike failed!" });
    }
    return res.status(200).json({
      status: 200,
      msg: "Unlike Successfully!",
      post: post.toObject({ getters: true }),
    });
  },
  bookmarkPost: async (req, res, next) => {
    const { postId, userId } = req.body;
    let post;
    try {
      post = await Post.findByIdAndUpdate(
        postId,
        {
          $addToSet: { bookmarks: userId },
        },
        { new: true }
      );
    } catch (err) {
      return res.json({ status: 500, msg: "Could not bookmark post" });
    }
    return res.status(200).json({
      status: 200,
      msg: "Save BookMark Success!",
      post: post.toObject({ getters: true }),
    });
  },
  unbookmarkPost: async (req, res, next) => {
    const { postId, userId } = req.body;
    let post;
    try {
      post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { bookmarks: userId },
        },
        { new: true }
      );
    } catch (err) {
      return res.json({ status: 500, msg: "Could not unbookmark post" });
    }
    return res.status(200).json({
      status: 200,
      msg: "Un Save BookMark Success!",
      post: post.toObject({ getters: true }),
    });
  },
  getBookmarks: async (req, res, next) => {
    const { userId } = req.params;
    let posts;
    try {
      posts = await Post.find({ bookmarks: userId })
        .populate("tags")
        .populate("author");
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Fetching posts failed. Please try again later",
      });
    }
    return res.json({
      status: 200,
      msg: "Get book mark Success!",
      posts: posts.map((post) => post.toObject({ getters: true })),
    });
  },
};
module.exports = postCtrl;
