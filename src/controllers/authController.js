const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const CompanyProfile = require("../models/CompanyProfile");
const generateToken = require("../utils/generateToken");

const calculateProfileCompletion = require(
  "../utils/calculateProfileCompletion"
);

const register = async (req, res,next) => {
  try {
    const { email, password, role, fullName, companyName } = req.body;

    // Check required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required",
      });
    }

    // Only student and company can register publicly
    if (role !== "student" && role !== "company") {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
    });

    // Create Student Profile
    if (role === "student") {
      if (!fullName) {
        return res.status(400).json({
          success: false,
          message: "Full name is required for student registration",
        });
      }

      const studentProfile = new StudentProfile({
        user: user._id,
        fullName,
      });

      studentProfile.profileCompletion =
        calculateProfileCompletion(studentProfile);
        await studentProfile.save();
      }

    // Create Company Profile
    if (role === "company") {
      if (!companyName) {
        return res.status(400).json({
          success: false,
          message: "Company name is required for company registration",
        });
      }

      await CompanyProfile.create({
        user: user._id,
        companyName,
      });
    }

    return res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user and explicitly include password
    const user = await User.findOne({ email }).select("+password");

    // Check user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Generate JWT
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
};