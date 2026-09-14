const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getPendingJobs,
  approveJob,
  rejectJob,
} = require("../controllers/adminJobController");

const router = express.Router();

router.get(
  "/pending",
  protect,
  authorizeRoles("admin"),
  getPendingJobs
);

router.put(
  "/:id/approve",
  protect,
  authorizeRoles("admin"),
  approveJob
);

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectJob
);

module.exports = router;