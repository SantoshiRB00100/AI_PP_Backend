const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getSkillRecommendations,
} = require("../controllers/skillRecommendationController");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("student"),
  getSkillRecommendations
);

module.exports = router;