const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getDashboardStats,
} = require("../controllers/adminDashboardController");

const router = express.Router();

// Get dashboard statistics - Admin only
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);

module.exports = router;