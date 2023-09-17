const multer = require("multer");
const path = require("path");

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination folder for uploaded files
    cb(null, path.join(__dirname, "uploads")); // You can customize the folder path
  },
  filename: function (req, file, cb) {
    // Define the file name for uploaded files
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Check the file's MIME type to allow only PNG, JPG, and JPEG files
  if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File format should be PNG, JPG, or JPEG"), false);
  }
};

// Create the multer instance with the defined storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { files: 5 }, // Limit the number of uploaded files to 5
});

module.exports = upload;
