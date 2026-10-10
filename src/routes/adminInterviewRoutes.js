const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllInterviews,
} = require("../controllers/adminInterviewController");

const router = express.Router();

// Get all interviews - Admin only
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllInterviews
);

module.exports = router;