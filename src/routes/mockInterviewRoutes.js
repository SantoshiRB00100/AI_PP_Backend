
const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  startMockInterview,
  submitMockInterviewAnswers,
  getMyMockInterviews,
} = require("../controllers/mockInterviewController");

const router = express.Router();

// Start a mock interview
router.post(
  "/start",
  protect,
  authorizeRoles("student"),
  startMockInterview
);

// Get the logged-in student's interview history
router.get(
  "/my-interviews",
  protect,
  authorizeRoles("student"),
  getMyMockInterviews
);

// Submit answers and receive AI evaluation
router.post(
  "/:interviewId/submit",
  protect,
  authorizeRoles("student"),
  submitMockInterviewAnswers
);

module.exports = router;
