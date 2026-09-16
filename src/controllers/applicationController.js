const Application = require("../models/Application");
const StudentProfile = require("../models/StudentProfile");
const Job = require("../models/Job");
const calculateJobMatch = require("../utils/calculateJobMatch");
const { matchResumeWithJob } = require("../services/aiService");

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

    // 5. Rule-based skill matching
    const matchResult = calculateJobMatch(
      student.skills,
      job.requiredSkills
    );

    console.log("Student skills:", student.skills);
    console.log("Job required skills:", job.requiredSkills);
    console.log("Rule-based match:", matchResult);

    // 6. Create job description for AI
    const jobDescription = `
Job Title: ${job.title}

Description:
${job.description}

Location:
${job.location}

Job Type:
${job.jobType}

Required Skills:
${job.requiredSkills.join(", ")}

Minimum CGPA:
${job.minimumCGPA || "Not specified"}
`;

    // 7. Create resume information for AI
    const resumeText = `
Student Skills:
${student.skills.join(", ")}

Education:
${JSON.stringify(student.education)}

Projects:
${JSON.stringify(student.projects)}

Resume Analysis:
${JSON.stringify(student.resumeAnalysis)}
`;

    // 8. Analyze student-job match using AI
    const aiMatchResult = await matchResumeWithJob(
      resumeText,
      jobDescription
    );

    console.log("AI match result:", aiMatchResult);

    // 9. Create application and save both matches
    const application = await Application.create({
      student: student._id,
      job: job._id,

      // Rule-based matching
      matchPercentage: matchResult.matchPercentage,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,

      // AI-based matching
      aiMatch: aiMatchResult,
    });

    console.log("Saved application:", application);

    // 10. Send response
    res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply For Job Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to apply for job",
    });
  }
};


// ==========================================
// AI JOB MATCHING
// ==========================================

const analyzeJobMatch = async (req, res) => {
  try {
    // Find logged-in student's profile
    const student = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Check whether resume exists
    if (!student.resume || !student.resume.url) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume first",
      });
    }

    // Find the job
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only approved jobs can be analyzed
    if (job.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "You can only analyze approved jobs",
      });
    }

    // Create job description from job data
    const jobDescription = `
Job Title: ${job.title}

Description:
${job.description}

Location:
${job.location}

Job Type:
${job.jobType}

Required Skills:
${job.requiredSkills.join(", ")}

Minimum CGPA:
${job.minimumCGPA || "Not specified"}
`;

    // Get resume text from saved AI analysis source
    const resumeText = `
Student Skills:
${student.skills.join(", ")}

Education:
${JSON.stringify(student.education)}

Projects:
${JSON.stringify(student.projects)}

Resume Analysis:
${JSON.stringify(student.resumeAnalysis)}
`;

    // Send resume and job description to Gemini
    const aiMatchResult = await matchResumeWithJob(
      resumeText,
      jobDescription
    );

    // Check whether the student has already applied
    const application = await Application.findOne({
      student: student._id,
      job: job._id,
    });

    // If application exists, save AI match to it
    if (application) {
      application.aiMatch = aiMatchResult;

      await application.save();
    }

    return res.status(200).json({
      success: true,
      message: "AI job match analyzed successfully",
      job: {
        id: job._id,
        title: job.title,
      },
      aiMatch: aiMatchResult,
      savedToApplication: !!application,
    });
  } catch (error) {
    console.error("AI Job Match Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze job match",
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
      .populate(
        "student",
        "fullName phone skills education projects resume"
      )
      .populate(
        "job",
        "title location jobType salary requiredSkills minimumCGPA aiMatchThreshold"
      )
      .sort({ createdAt: -1 });

    // 3. Format applicant information for recruiter
    const formattedApplications = applications.map((application) => ({
      applicationId: application._id,

      student: application.student,

      job: application.job,

      status: application.status,

      ruleBasedMatch: {
        matchPercentage: application.matchPercentage,
        matchedSkills: application.matchedSkills,
        missingSkills: application.missingSkills,
      },

      aiMatch: application.aiMatch || null,

      appliedAt: application.createdAt,
    }));

    // 4. Send applicant information to recruiter
    res.status(200).json({
      success: true,
      count: formattedApplications.length,
      applications: formattedApplications,
    });
  } catch (error) {
    console.error("Get Company Applications Error:", error.message);

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

const aiShortlistApplicants = async (req, res) => {
  try {
    // 1. Find the job
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 2. Make sure this company owns the job
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot shortlist applicants for this job",
      });
    }

    // 3. Find all applications for this job
    const applications = await Application.find({
      job: job._id,
    }).populate(
      "student",
      "fullName phone skills education projects resume"
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found for this job",
      });
    }

    // 4. Get the AI match threshold
    const threshold = job.aiMatchThreshold || 60;

    // 5. Shortlist candidates who meet the threshold
    const shortlistedApplicants = [];

    for (const application of applications) {
      const aiMatchPercentage =
        application.aiMatch?.matchPercentage || 0;

      if (
        aiMatchPercentage >= threshold &&
        application.status === "applied"
      ) {
        application.status = "shortlisted";

        await application.save();

        shortlistedApplicants.push({
          applicationId: application._id,
          student: application.student,
          aiMatchPercentage,
          status: application.status,
        });
      }
    }

    // 6. Send response
    return res.status(200).json({
      success: true,
      message: "AI shortlisting completed successfully",
      job: {
        id: job._id,
        title: job.title,
      },
      threshold,
      totalApplications: applications.length,
      shortlistedCount: shortlistedApplicants.length,
      shortlistedApplicants,
    });
  } catch (error) {
    console.error("AI Shortlist Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to shortlist applicants",
    });
  }
};


module.exports = {
  applyForJob,
  analyzeJobMatch,
  aiShortlistApplicants,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
};