const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  applyForJob,
  analyzeJobMatch,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
  aiShortlistApplicants
} = require("../controllers/applicationController");

const router = express.Router();

// Apply for a job
router.post(
  "/:jobId",
  protect,
  authorizeRoles("student"),
  applyForJob
);

// AI job match analysis
router.get(
  "/job-match/:jobId",
  protect,
  authorizeRoles("student"),
  analyzeJobMatch
);

// Get student's applications
router.get(
  "/my-applications",
  protect,
  authorizeRoles("student"),
  getMyApplications
);

// Get company's applications
router.get(
  "/company",
  protect,
  authorizeRoles("company"),
  getCompanyApplications
);

// AI shortlist applicants
router.put(
  "/ai-shortlist/:jobId",
  protect,
  authorizeRoles("company"),
  aiShortlistApplicants
);

// Update application status
router.put(
  "/:applicationId/status",
  protect,
  authorizeRoles("company"),
  updateApplicationStatus
);

module.exports = router;