const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Absolute path for uploads folder
const uploadDir = path.join(
  __dirname,
  "../../uploads/resumes"
);

// Create folder automatically if it does not exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Allow only PDF files
const fileFilter = (req, file, cb) => {
  const isPdf =
    file.mimetype === "application/pdf" &&
    path.extname(file.originalname).toLowerCase() === ".pdf";

  if (isPdf) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF files are allowed"),
      false
    );
  }
};

const resumeUpload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = resumeUpload;
