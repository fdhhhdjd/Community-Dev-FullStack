const { uploadToCloudinary } = require("../Utils/Upload.js");
const UploadCtrl = {
  UploadAvatar: async (req, res, next) => {
    const imageUrl = await uploadToCloudinary(req.file);
    res.status(200).json({
      public_id: imageUrl.public_id,
      url: imageUrl.url,
    });
  },
};
module.exports = UploadCtrl;
