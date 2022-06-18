const { check } = require("express-validator");
const commentCtrl = require("../Controllers/CommentCtl.js");
const checkAuth = require("../Middlewares/CheckAuth");
const router = require("express").Router();

//! Get id Comment
router.get("/:postId", commentCtrl.getCommentId);

//!Create Comment
router.post("/", commentCtrl.createComment);

//! Update Comment
router.put("/:commentId", commentCtrl.updateComment);

//! Delete Comment

router.delete("/:commentId", commentCtrl.deleteComment);

//! Like Comment
router.put("/:commentId/like", commentCtrl.likeComment);

//! UnLike Comment
router.put("/:commentId/unlike", commentCtrl.unlikeComment);

//todo--> Check Token
router.use(checkAuth);
module.exports = router;
