const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllStudents,
  getStudentById,
  updateStudentStatus,
} = require("../controllers/adminStudentController");

const router = express.Router();

// Get all students - Admin only
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllStudents
);

// Get student by ID - Admin only
router.get(
  "/:studentId",
  protect,
  authorizeRoles("admin"),
  getStudentById
);

// Activate / Deactivate student - Admin only
router.put(
  "/:studentId/status",
  protect,
  authorizeRoles("admin"),
  updateStudentStatus
);

module.exports = router;