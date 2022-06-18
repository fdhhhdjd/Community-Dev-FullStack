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
const updateTags = async (tags, post) => {
  await createTags(tags, post);
  await removeTags(tags, post);
};

const removeTags = async (tags, post) => {
  for (const [i, tag] of post.tags.entries()) {
    if (!tags.includes(tag.name)) {
      await Tag.updateOne(
        { _id: post.tags[i]._id },
        { $pull: { posts: post._id } }
      );
      await Post.updateOne(
        { _id: post._id },
        { $pull: { tags: post.tags[i]._id } }
      );
    }
  }
};

exports.createTags = createTags;
exports.updateTags = updateTags;
