const Application = require("../models/Application");
const StudentProfile = require("../models/StudentProfile");
const Job = require("../models/Job");
const calculateJobMatch = require("../utils/calculateJobMatch");

const applyForJob = async (req, res) => {
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

    // 2. Find job
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const matchResult = calculateJobMatch(
      student.skills,
      job.requiredSkills
    );

    console.log("Student skills:", student.skills);
    console.log("Job required skills:", job.requiredSkills);
    console.log("Match result:", matchResult);

    // 3. Only approved jobs can be applied to
    if (job.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "You can only apply for approved jobs",
      });
    }

    // 4. Check if already applied
    const existingApplication = await Application.findOne({
      student: student._id,
      job: job._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // 5. Create application
    const application = await Application.create({
      student: student._id,
      job: job._id,
      matchPercentage: matchResult.matchPercentage,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills
    });

    console.log("Saved application:", application);

    res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to apply for job",
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const student = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const applications = await Application.find({
      student: student._id,
    })
      .populate("job", "title location jobType salary requiredSkills")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

const getCompanyApplications = async (req, res) => {
  try {
    // 1. Find all jobs belonging to this company
    const jobs = await Job.find({
      company: req.user._id,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // 2. Find applications for those jobs
    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("student", "fullName phone skills education projects resume")
      .populate("job", "title location jobType salary requiredSkills")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch company applications",
    });
  }
};


const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "shortlisted",
      "interview",
      "selected",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // 1. Find application
    const application = await Application.findById(
      req.params.applicationId
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // 2. Find the job connected to this application
    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 3. Make sure this company owns the job
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this application",
      });
    }

    // 4. Update status
    application.status = status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
};