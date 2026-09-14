const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const resumeUpload = require("../middleware/uploadMiddleware");

const {
  getMyProfile,
  updateMyProfile,
  uploadResume,
} = require("../controllers/studentController");

const router = express.Router();

router.get(
  "/profile",
  protect,
  authorizeRoles("student"),
  getMyProfile
);

router.put(
  "/profile",
  protect,
  authorizeRoles("student"),
  updateMyProfile
);

router.post(
  "/resume",
  protect,
  authorizeRoles("student"),
  resumeUpload.single("resume"),
  uploadResume
);

module.exports = router;


