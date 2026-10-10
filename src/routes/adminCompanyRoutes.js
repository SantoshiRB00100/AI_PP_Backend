const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllCompanies,
  updateCompanyStatus
} = require("../controllers/adminCompanyController");

const router = express.Router();

// Get all companies - Admin only
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllCompanies
);

// Activate / Deactivate company - Admin only
router.put(
  "/:companyId/status",
  protect,
  authorizeRoles("admin"),
  updateCompanyStatus
);

module.exports = router;