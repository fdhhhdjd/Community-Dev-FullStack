const UploadCtrl = require("../Controllers/UploadCtl");
const { fileUpload } = require("../Middlewares/file-upload");
const router = require("express").Router();
//!Upload Cloud Avatar
router.post("/avatar", fileUpload.single("image"), UploadCtrl.UploadAvatar);
module.exports = router;
