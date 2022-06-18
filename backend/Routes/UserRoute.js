const { check } = require("express-validator");
const userCtrl = require("../Controllers/UserCtl");
const postCtrl = require("../Controllers/PostCtl");
const checkAuth = require("../Middlewares/CheckAuth");
const router = require("express").Router();
//!Get User Id
router.get("/:userId", userCtrl.GetUserId);

//!Get getBookmarks user
router.get("/:userId/bookmarks", postCtrl.getBookmarks);
//!Login
router.post("/login", userCtrl.Login);

//!Login Google
router.post("/google", userCtrl.LoginGoogle);

//!Login Facebook
router.post("/facebook", userCtrl.LoginFacebook);

//!Register
router.post(
  "/register",
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() //Tai@Tai.com => tai@tai.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userCtrl.Register
);

//! Update User Profile
router.patch("/:userId", userCtrl.UpdateUserProfile);

//! Follower
router.put("/follow", checkAuth, userCtrl.FollowUser);

//! UnFollower
router.put("/unfollow", checkAuth, userCtrl.unfollowUser);

module.exports = router;
