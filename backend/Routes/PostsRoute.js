const { check } = require("express-validator");
const postCtrl = require("../Controllers/PostCtl.js");
const checkAuth = require("../Middlewares/CheckAuth");
const router = require("express").Router();
//!Create Post
router.use(checkAuth);
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
router.get("/user/:userId", postCtrl.getPostsByUserId);
module.exports = router;
