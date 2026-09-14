const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  applyForJob,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const router = express.Router();

router.post(
  "/:jobId",
  protect,
  authorizeRoles("student"),
  applyForJob
);

router.get(
  "/my-applications",
  protect,
  authorizeRoles("student"),
  getMyApplications
);

router.get(
  "/company",
  protect,
  authorizeRoles("company"),
  getCompanyApplications
);

router.put(
  "/:applicationId/status",
  protect,
  authorizeRoles("company"),
  updateApplicationStatus
);

module.exports = router;