const StudentProfile = require(
  "../models/StudentProfile"
);

const calculateProfileCompletion = require(
  "../utils/calculateProfileCompletion"
);


// GET logged-in student's profile
const getMyProfile = async (req, res) => {
  try {
    const profile =
      await StudentProfile.findOne({
        user: req.user._id,
      }).populate(
        "user",
        "email role"
      );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error(
      "Get Profile Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// UPDATE student's profile
const updateMyProfile = async (req, res) => {
  try {
    const {
      phone,
      skills,
      education,
      projects,
    } = req.body;

    const profile =
      await StudentProfile.findOne({
        user: req.user._id,
      });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    if (phone !== undefined) {
      profile.phone = phone;
    }

    if (skills !== undefined) {
      profile.skills = skills;
    }

    if (education !== undefined) {
      profile.education = education;
    }

    if (projects !== undefined) {
      profile.projects = projects;
    }

    // Recalculate completion
    profile.profileCompletion =
      calculateProfileCompletion(profile);

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });

  } catch (error) {
    console.error(
      "Update Profile Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// UPLOAD RESUME
const uploadResume = async (req, res) => {
  try {
    console.log("Uploaded file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume PDF",
      });
    }

    const profile = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    profile.resume = {
      url: `/uploads/resumes/${req.file.filename}`,
      fileName: req.file.originalname,
    };

    profile.profileCompletion =
      calculateProfileCompletion(profile);

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: profile.resume,
      profileCompletion: profile.profileCompletion,
    });

  } catch (error) {
    console.error(
      "Resume Upload Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadResume,
};