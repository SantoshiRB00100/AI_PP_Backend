const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

// ==========================================
// GET ADMIN DASHBOARD STATISTICS
// ==========================================

const getDashboardStats = async (req, res) => {
  try {
    // Count users by role
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalCompanies = await User.countDocuments({
      role: "company",
    });

    // Count jobs
    const totalJobs = await Job.countDocuments();

    const pendingJobs = await Job.countDocuments({
      status: "pending",
    });

    const approvedJobs = await Job.countDocuments({
      status: "approved",
    });

    const rejectedJobs = await Job.countDocuments({
      status: "rejected",
    });

    const closedJobs = await Job.countDocuments({
      status: "closed",
    });

    // Count applications
    const totalApplications = await Application.countDocuments();

    const appliedApplications = await Application.countDocuments({
      status: "applied",
    });

    const shortlistedApplications = await Application.countDocuments({
      status: "shortlisted",
    });

    const interviewApplications = await Application.countDocuments({
      status: "interview",
    });

    const selectedApplications = await Application.countDocuments({
      status: "selected",
    });

    const rejectedApplications = await Application.countDocuments({
      status: "rejected",
    });

    // Count interviews
    const totalInterviews = await Interview.countDocuments();

    const scheduledInterviews = await Interview.countDocuments({
      status: "scheduled",
    });

    const completedInterviews = await Interview.countDocuments({
      status: "completed",
    });

    const cancelledInterviews = await Interview.countDocuments({
      status: "cancelled",
    });

    const rescheduledInterviews = await Interview.countDocuments({
      status: "rescheduled",
    });

    // Return dashboard statistics
    return res.status(200).json({
      success: true,

      students: {
        total: totalStudents,
      },

      companies: {
        total: totalCompanies,
      },

      jobs: {
        total: totalJobs,
        pending: pendingJobs,
        approved: approvedJobs,
        rejected: rejectedJobs,
        closed: closedJobs,
      },

      applications: {
        total: totalApplications,
        applied: appliedApplications,
        shortlisted: shortlistedApplications,
        interview: interviewApplications,
        selected: selectedApplications,
        rejected: rejectedApplications,
      },

      interviews: {
        total: totalInterviews,
        scheduled: scheduledInterviews,
        completed: completedInterviews,
        cancelled: cancelledInterviews,
        rescheduled: rescheduledInterviews,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};