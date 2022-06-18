const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Comment = require("../Models/CommentModel");
const User = require("../Models/UserModel");
const Post = require("../Models/PostModel");
const { removeCommentNotification } = require("../Controllers/NotifucationCtl");
const commentCtrl = {
  createComment: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: 400,
        msg: "Invalid inputs passed, please check your data",
      });
    }
    const { parentPost, body, author, date, parentId, userId } = req.body;
    let post;

    try {
      post = await Post.findById(parentPost); //check if the post ID exists
    } catch (err) {
      return res.json({
        status: 400,
        message: "Creating comment failed, please try again",
      });
    }
    let user;
    try {
      user = await User.findById(author); //check if the user ID exists
    } catch (err) {
      return res.json({
        status: 500,
        message: "Creating comment failed, please try again",
      });
    }

    if (!user) {
      return res.json({
        status: 400,
        message: "Could not find user for provided ID",
      });
    }

    let createdComment = new Comment({
      parentId,
      parentPost,
      body,
      author,
      date,
    });
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      createdComment = await Comment.populate(createdComment, {
        path: "author",
      });
      post.comments.push(createdComment);
      user.comments.push(createdComment);
      createdComment.likes.push(author);
      await createdComment.save({ session: sess });
      await post.save({ session: sess });
      await user.save({ session: sess });
      await sess.commitTransaction();
      if (post.author.toString() !== userId) {
        await commentNotification(
          userId, //sender
          post.id,
          createdComment.id,
          post.author.toString() //author => receiver
        );
      }
    } catch (err) {
      return res.json({
        status: 500,
        message: "Creating comment failed, please try again",
      });
    }
    return res.status(200).json({
      status: 200,
      msg: "Create Comment Successful",
      comment: createdComment.toObject({ getters: true }),
    });
  },
  getCommentId: async (req, res, next) => {
    const { postId } = req.params;
    let comments;
    try {
      comments = await Comment.find({ parentPost: postId }).populate("author");
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Fetching comments failed. Please try again",
      });
    }
    if (!comments || comments.length === 0) {
      return res.status(200).json({
        status: 200,
        msg: "No comments for the post",
      });
    }
    return res.json({
      status: 200,
      msg: "Comment Id Post Success !",
      comments: comments.map((comment) => comment.toObject({ getters: true })),
    });
  },
  updateComment: async (req, res, next) => {
    const { commentId } = req.params;
    const { author, body } = req.body;
    let comment;
    try {
      comment = await Comment.findById(commentId).populate("author");
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Could not update post, please try again",
      });
    }
    console.log(comment.author.id);
    if (comment.author.id !== author) {
      return res.json({
        status: 400,
        msg: "You are not allowed to update the comment",
      });
    }
    comment.body = body;
    try {
      await comment.save();
      return res.status(200).json({
        status: 200,
        msg: "update Comment Successfully!",
        comment: comment.toObject({ getters: true }),
      });
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Could not update comment",
      });
    }
  },
  deleteComment: async (req, res, next) => {
    const { commentId } = req.params;
    const { author } = req.body;
    let comment;
    try {
      comment = await Comment.findById(commentId)
        .populate("author")
        .populate("parentPost");
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Could not delete comment",
      });
    }
    if (!comment) {
      return res.json({
        status: 400,
        msg: "Could not find comment for the provided ID.",
      });
    }
    if (comment.author.id !== author) {
      return res.json({
        status: 400,
        msg: "You are not allowed to delete the comment",
      });
    }
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await comment.remove({ session: sess });
      comment.author.comments.pull(comment);
      comment.parentPost.comments.pull(comment);
      await comment.author.save({ session: sess });
      await comment.parentPost.save({ session: sess });
      await removeCommentNotification(
        comment.author.id,
        comment.parentPost.id,
        commentId,
        comment.parentPost.author
      );
      await sess.commitTransaction();
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Deleting comment failed, please try again",
      });
    }
    return res.status(200).json({
      status: 200,
      msg: "Deleted comment",
    });
  },
  likeComment: async (req, res, next) => {
    const { commentId, userId } = req.body;
    let comment;
    try {
      comment = await Comment.findByIdAndUpdate(
        commentId,
        { $addToSet: { likes: userId } },
        { new: true }
      ).populate("author");
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Could not like comment",
      });
    }
    return res.status(200).json({
      status: 200,
      msg: "Like Comment Successfully",
      comment: comment.toObject({ getters: true }),
    });
  },
  unlikeComment: async (req, res, next) => {
    const { commentId, userId } = req.body;
    let comment;
    try {
      comment = await Comment.findByIdAndUpdate(
        commentId,
        { $pull: { likes: userId } },
        { new: true }
      ).populate("author");
    } catch (err) {
      return res.json({
        status: 500,
        msg: "Could not Unlike comment",
      });
    }
    return res.status(200).json({
      status: 200,
      msg: "UnLike Comment Successfully",
      comment: comment.toObject({ getters: true }),
    });
  },
};
module.exports = commentCtrl;
