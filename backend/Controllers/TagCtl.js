const Tag = require("../Models/TagModel");
const Post = require("../Models/PostModel");
const User = require("../Models/UserModel");

const { validationResult } = require("express-validator");

const createTags = async (tags, post) => {
  console.log(tags);
  for (const [i, tag] of tags.entries()) {
    const postTag = await Tag.findOneAndUpdate(
      { name: tag.toLowerCase() },
      { $addToSet: { posts: post._id } },
      { upsert: true, new: true }
    );
    await Post.updateOne(
      { _id: post._id },
      { $addToSet: { tags: postTag._id } }
    );
  }
};

exports.createTags = createTags;
