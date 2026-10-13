const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  chatWithCareerAssistant,
} = require("../controllers/careerAssistantController");

const router = express.Router();

// Only authenticated students can use the Career Assistant
router.post(
  "/chat",
  protect,
  authorizeRoles("student"),
  chatWithCareerAssistant
);

module.exports = router;