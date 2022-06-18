const mongoose = require("mongoose");
const Post = require("../Models/PostModel");
const User = require("../Models/UserModel");
const Notification = require("../Models/NotificationModel");
const likeNotification = async (senderId, postId, receiverId, next) => {
  //senderId : logged in user
  //receiverId : the user to notify
  //!Notification
  try {
    const createdNotification = new Notification({
      notificationType: "like",
      sender: senderId,
      receiver: receiverId,
      post: postId,
    });
    await createdNotification.save();
    return;
  } catch (err) {
    return err.message;
  }
};
//!like
const removeLikeNotification = async (senderId, postId, receiverId, next) => {
  try {
    await Notification.findOneAndDelete({
      receiver: receiverId,
      notificationType: "like",
      sender: senderId,
      post: postId,
    });
    return;
  } catch (err) {
    return err.message;
  }
};
//!Follow
const followNotification = async (senderId, receiverId) => {
  try {
    const createdNotification = new Notification({
      receiver: receiverId,
      notificationType: "follow",
      sender: senderId,
    });
    await createdNotification.save();
    return;
  } catch (err) {
    return err.message;
  }
};

const removeFollowNotification = async (senderId, receiverId) => {
  try {
    await Notification.findOneAndDelete({
      receiver: receiverId,
      notificationType: "follow",
      sender: senderId,
    });
    return;
  } catch (err) {
    return err.message;
  }
};

//!Comment
const removeCommentNotification = async (
  senderId,
  postId,
  commentId,
  receiverId
) => {
  try {
    await Notification.findOneAndDelete({
      receiver: receiverId,
      notificationType: "comment",
      sender: senderId,
      post: postId,
      comment: commentId,
    });
    return;
  } catch (err) {
    return err.message;
  }
};
exports.likeNotification = likeNotification;
exports.removeLikeNotification = removeLikeNotification;
exports.followNotification = followNotification;
exports.removeFollowNotification = removeFollowNotification;
exports.removeCommentNotification = removeCommentNotification;
