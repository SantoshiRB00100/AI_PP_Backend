const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createJob,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getApprovedJobs,
} = require("../controllers/jobController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("company"),
  createJob
);

router.get(
  "/my-jobs",
  protect,
  authorizeRoles("company"),
  getMyJobs
);

router.get(
  "/:id",
  protect,
  getJobById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("company"),
  updateJob
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("company"),
  deleteJob
);

router.get(
  "/",
  protect,
  authorizeRoles("student"),
  getApprovedJobs
);

module.exports = router;