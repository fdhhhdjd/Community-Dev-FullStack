const { check } = require("express-validator");
const userCtrl = require("../Controllers/UserCtl");

const multer = require("multer");

const router = require("express").Router();
//!Login
router.post("/login", userCtrl.Login);

//!Login Gooogle
router.post("/google", userCtrl.LoginGoogle);

//!Login Gooogle
router.post("/facebook", userCtrl.LoginFacebook);

//!Get User Id
router.get("/:userId", userCtrl.GetUserId);

//! Update User Profile

router.patch("/:userId", userCtrl.UpdateUserProfile);

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

module.exports = router;
