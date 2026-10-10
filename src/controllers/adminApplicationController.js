const Application = require("../models/Application");

// ==========================================
// GET ALL APPLICATIONS - ADMIN
// ==========================================

const getAllApplications = async (req, res) => {
  try {
    // 1. Get all applications
    const applications = await Application.find()
      .populate(
        "student",
        "fullName phone skills education projects resume"
      )
      .populate(
        "job",
        "title description location jobType salary requiredSkills minimumCGPA company"
      )
      .sort({ createdAt: -1 });

    // 2. Return applications
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get All Applications Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

module.exports = {
  getAllApplications,
};