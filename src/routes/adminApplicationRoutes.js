const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllApplications,
} = require("../controllers/adminApplicationController");

const router = express.Router();

// Get all applications - Admin only
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllApplications
);

module.exports = router;