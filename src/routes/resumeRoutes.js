const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  analyzeResume,
  getResumeAnalysis,
} = require("../controllers/resumeController");

const router = express.Router();

// Analyze resume using AI
router.post(
  "/analyze",
  protect,
  authorizeRoles("student"),
  analyzeResume
);

// Get previously saved AI resume analysis
router.get(
  "/analysis",
  protect,
  authorizeRoles("student"),
  getResumeAnalysis
);

module.exports = router;