const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      jobType,
      salary,
      requiredSkills,
      minimumCGPA,
      aiMatchThreshold,
      applicationDeadline,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !location ||
      !requiredSkills ||
      requiredSkills.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, location and required skills are required",
      });
    }

    // Create job
    const job = await Job.create({
      company: req.user._id,
      title,
      description,
      location,
      jobType,
      salary,
      requiredSkills,
      minimumCGPA,
      aiMatchThreshold,
      applicationDeadline,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      company: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get My Jobs Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Students can only view approved jobs
    if (
      req.user.role === "student" &&
      job.status !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message: "This job is not available",
      });
    }

    // Companies can only view their own jobs
    if (
      req.user.role === "company" &&
      job.company._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own jobs",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      company: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you do not own this job",
      });
    }

    const {
      title,
      description,
      location,
      jobType,
      salary,
      requiredSkills,
      minimumCGPA,
      aiMatchThreshold,
      applicationDeadline,
    } = req.body;

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (location !== undefined) job.location = location;
    if (jobType !== undefined) job.jobType = jobType;
    if (salary !== undefined) job.salary = salary;
    if (requiredSkills !== undefined) job.requiredSkills = requiredSkills;
    if (minimumCGPA !== undefined) job.minimumCGPA = minimumCGPA;
    if (aiMatchThreshold !== undefined) {
      job.aiMatchThreshold = aiMatchThreshold;
    }
    if (applicationDeadline !== undefined) {
      job.applicationDeadline = applicationDeadline;
    }

    // Send updated job back for admin approval
    if (job.status === "approved") {
      job.status = "pending";
    }

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully and sent for approval",
      job,
    });
  } catch (error) {
    console.error("Update Job Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      company: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you do not own this job",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getApprovedJobs = async (req, res) => {
  try {
    const { location, jobType, minSalary, skill } = req.query;

    const filter = {
      status: "approved",
    };

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (minSalary) {
      filter["salary.max"] = {
        $gte: Number(minSalary),
      }
    }

    if(skill){
      filter.requiredSkills = {
        $regex: skill,
        $options: "i",
      };
    }
    
    const jobs = await Job.find(filter)
      .populate("company", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

module.exports = {
  createJob,
  getMyJobs,
  getJobById,
  getApprovedJobs,
  updateJob,
  deleteJob,
};