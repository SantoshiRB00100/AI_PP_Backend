const StudentProfile = require("../models/StudentProfile");

// ==========================================
// GET ALL STUDENTS - ADMIN
// ==========================================

const getAllStudents = async (req, res) => {
  try {
    const students = await StudentProfile.find()
      .populate("user", "email role isActive")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get All Students Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// ==========================================
// ACTIVATE / DEACTIVATE STUDENT - ADMIN
// ==========================================

const updateStudentStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    const student = await StudentProfile.findById(req.params.studentId)
      .populate("user");

    if (!student || !student.user) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.user.isActive = isActive;

    await student.user.save();

    return res.status(200).json({
      success: true,
      message: isActive
        ? "Student activated successfully"
        : "Student deactivated successfully",
      student: {
        studentId: student._id,
        email: student.user.email,
        role: student.user.role,
        isActive: student.user.isActive,
      },
    });
  } catch (error) {
    console.error("Update Student Status Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update student status",
    });
  }
};


// ==========================================
// GET STUDENT BY ID - ADMIN
// ==========================================

const getStudentById = async (req, res) => {
  try {
    const student = await StudentProfile.findById(req.params.studentId)
      .populate("user", "email role isActive");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get Student By ID Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student",
    });
  }
};

module.exports = {
  getAllStudents,
  updateStudentStatus,
  getStudentById,
};