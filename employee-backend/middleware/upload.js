const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "employee-tracker/suspects",
    resource_type: "image"
  }
});

const upload = multer({ storage });

module.exports = upload;
