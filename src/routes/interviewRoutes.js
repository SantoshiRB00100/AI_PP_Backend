const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  scheduleInterview,
  getMyInterviews,
  getCompanyInterviews,
  updateInterview,
} = require("../controllers/interviewController");

const router = express.Router();

// Schedule interview
router.post(
  "/schedule",
  protect,
  authorizeRoles("company"),
  scheduleInterview
);

// Get my interviews - Student
router.get(
  "/my-interviews",
  protect,
  authorizeRoles("student"),
  getMyInterviews
);

// Get company interviews - Company
router.get(
  "/company",
  protect,
  authorizeRoles("company"),
  getCompanyInterviews
);

// Update interview - Company
router.put(
  "/:interviewId",
  protect,
  authorizeRoles("company"),
  updateInterview
);

module.exports = router;