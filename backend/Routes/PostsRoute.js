const { check } = require("express-validator");
const postCtrl = require("../Controllers/PostCtl.js");
const checkAuth = require("../Middlewares/CheckAuth");
const router = require("express").Router();

// //!Get Post Id User
router.get("/user/:userId", postCtrl.getPostsByUserId);

// //!Get Post Id
router.get("/:titleURL/:postId", postCtrl.getPostId);

// //!Get All Post
router.get("/", postCtrl.getAllPost);

//!Search Post
router.get("/search?", postCtrl.getSearchResults);

//todo--> Check Token
router.use(checkAuth);

//!Create Post
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("body").not().isEmpty(),
    check("tags").not().isEmpty(),
    check("titleURL").not().isEmpty(),
    check("author").not().isEmpty(),
  ],
  postCtrl.createPost
);

//!Update Post
router.patch(
  "/:titleURL/:postId",
  [
    check("title").not().isEmpty(),
    check("body").not().isEmpty(),
    check("tags").not().isEmpty(),
    check("titleURL").not().isEmpty(),
  ],
  postCtrl.updatePost
);

//! Delete Post
router.delete("/:titleURL/:postId", postCtrl.deletePost);

//!Like Post
router.put("/:postId/like", postCtrl.likePost);

//!UnLike Post
router.put("/:postId/unlike", postCtrl.unlikePost);

//!Book Mark
router.put("/:postId/bookmark", postCtrl.bookmarkPost);

//!UnBook Mark
router.put("/:postId/unbookmark", postCtrl.unbookmarkPost);

module.exports = router;
