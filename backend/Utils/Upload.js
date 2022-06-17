const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const path = require("path");
require("dotenv").config();
const { cloudinary } = require("../Configs/cloudinary");
const uploadToCloudinary = async (file) => {
  try {
    const extName = path.extname(file.originalname).toString();
    const file64 = parser.format(extName, file.buffer);
    const uploadedResponse = await cloudinary.uploader.upload(file64.content, {
      folder: process.env.CLOUDINARY_CLOUD_FOLDER,
    });
    return uploadedResponse;
  } catch (err) {
    console.log(err);
  }
};

exports.uploadToCloudinary = uploadToCloudinary;
