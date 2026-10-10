const Interview = require("../models/Interview");

// ==========================================
// GET ALL INTERVIEWS - ADMIN
// ==========================================

const getAllInterviews = async (req, res) => {
  try {
    // 1. Get all interviews
    const interviews = await Interview.find()
      .populate(
        "application",
        "status matchPercentage aiMatch"
      )
      .populate(
        "company",
        "email role isActive"
      )
      .populate(
        "student",
        "fullName phone skills education projects resume"
      )
      .sort({ scheduledAt: 1 });

    // 2. Return interviews
    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Get All Interviews Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
    });
  }
};

module.exports = {
  getAllInterviews,
};