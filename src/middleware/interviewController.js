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


module.exports = {
  scheduleInterview,
};