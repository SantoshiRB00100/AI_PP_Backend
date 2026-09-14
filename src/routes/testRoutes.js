const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Any logged-in user can access this
router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed a protected route successfully",
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// Only students
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Student",
    });
  }
);

// Only companies
router.get(
  "/company",
  protect,
  authorizeRoles("company"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Company",
    });
  }
);

// Only admin
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

module.exports = router;