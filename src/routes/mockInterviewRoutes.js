
const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  startMockInterview,
  submitMockInterviewAnswers,
} = require("../controllers/mockInterviewController");

const router = express.Router();

// Start a mock interview
router.post(
  "/start",
  protect,
  authorizeRoles("student"),
  startMockInterview
);

// Submit answers and receive AI evaluation
router.post(
  "/:interviewId/submit",
  protect,
  authorizeRoles("student"),
  submitMockInterviewAnswers
);

module.exports = router;
