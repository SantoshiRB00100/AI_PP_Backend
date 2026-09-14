const Job = require("../models/Job");

const getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: "pending",
    })
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
      message: "Failed to fetch pending jobs",
    });
  }
};

const approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending jobs can be approved",
      });
    }

    job.status = "approved";

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job approved successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve job",
    });
  }
};

const rejectJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending jobs can be rejected",
      });
    }

    job.status = "rejected";

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job rejected successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject job",
    });
  }
};

module.exports = {
  getPendingJobs,
  approveJob,
  rejectJob,
};