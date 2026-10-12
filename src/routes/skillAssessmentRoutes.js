
const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  startAssessment,
  submitAssessment,
} = require("../controllers/skillAssessmentController");

const router = express.Router();

router.post(
  "/start",
  protect,
  authorizeRoles("student"),
  startAssessment
);

router.post(
  "/:assessmentId/submit",
  protect,
  authorizeRoles("student"),
  submitAssessment
);

module.exports = router;

