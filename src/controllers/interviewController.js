const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Job = require("../models/Job");
const StudentProfile = require("../models/StudentProfile");


// ==========================================
// SCHEDULE INTERVIEW
// ==========================================

const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      scheduledAt,
      mode,
      meetingLink,
      location,
      notes,
    } = req.body;

    // 1. Check application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // 2. Find job
    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 3. Make sure company owns the job
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot schedule an interview for this application",
      });
    }

    // 4. Find student profile
    const student = await StudentProfile.findById(application.student);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // 5. Make sure application is shortlisted
    if (application.status !== "shortlisted") {
      return res.status(400).json({
        success: false,
        message: "Only shortlisted students can be scheduled for an interview",
      });
    }

    // 6. Validate interview date
    if (!scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Interview date and time are required",
      });
    }

    // 7. Create interview
    const interview = await Interview.create({
      application: application._id,
      company: req.user._id,
      student: student._id,
      scheduledAt,
      mode,
      meetingLink,
      location,
      notes,
    });

    // 8. Update application status
    application.status = "interview";

    await application.save();

    // 9. Send response
    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      interview,
    });
  } catch (error) {
    console.error("Schedule Interview Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to schedule interview",
    });
  }
};

// ==========================================
// GET MY INTERVIEWS - STUDENT
// ==========================================

const getMyInterviews = async (req, res) => {
  try {
    // 1. Find student profile
    const student = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // 2. Find student's interviews
    const interviews = await Interview.find({
      student: student._id,
    })
      .populate("company", "email")
      .populate(
        "application",
        "status matchPercentage aiMatch"
      )
      .populate(
        "student",
        "fullName"
      )
      .sort({ scheduledAt: 1 });

    // 3. Return interviews
    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Get My Interviews Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
    });
  }
};


// ==========================================
// GET COMPANY INTERVIEWS
// ==========================================

const getCompanyInterviews = async (req, res) => {
  try {
    // 1. Find all interviews scheduled by this company
    const interviews = await Interview.find({
      company: req.user._id,
    })
      .populate(
        "student",
        "fullName phone skills education projects resume"
      )
      .populate(
        "application",
        "status matchPercentage aiMatch"
      )
      .sort({ scheduledAt: 1 });

    // 2. Return interviews
    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error(
      "Get Company Interviews Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch company interviews",
    });
  }
};



// ==========================================
// UPDATE INTERVIEW - COMPANY
// ==========================================

const updateInterview = async (req, res) => {
  try {
    const {
      scheduledAt,
      mode,
      meetingLink,
      location,
      status,
      notes,
    } = req.body;

    // 1. Find interview
    const interview = await Interview.findById(req.params.interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // 2. Make sure company owns this interview
    if (
      interview.company.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this interview",
      });
    }

    // 3. Update only provided fields
    if (scheduledAt !== undefined) {
      interview.scheduledAt = scheduledAt;
    }

    if (mode !== undefined) {
      interview.mode = mode;
    }

    if (meetingLink !== undefined) {
      interview.meetingLink = meetingLink;
    }

    if (location !== undefined) {
      interview.location = location;
    }

    if (status !== undefined) {
      const allowedStatuses = [
        "scheduled",
        "completed",
        "cancelled",
        "rescheduled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid interview status",
        });
      }

      interview.status = status;
    }

    if (notes !== undefined) {
      interview.notes = notes;
    }

    // 4. Save changes
    await interview.save();

    // 5. Return updated interview
    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview,
    });
  } catch (error) {
    console.error("Update Interview Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update interview",
    });
  }
};

module.exports = {
  scheduleInterview,
  getMyInterviews,
  getCompanyInterviews,
  updateInterview,
};
