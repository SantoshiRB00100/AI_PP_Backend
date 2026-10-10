const express = require("express");
const cors = require("cors");
const multer = require("multer");

const authRoutes = require("./src/routes/authRoutes");
const testRoutes = require("./src/routes/testRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const resumeRoutes = require("./src/routes/resumeRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const adminJobRoutes = require("./src/routes/adminJobRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const interviewRoutes = require("./src/routes/interviewRoutes");
const adminStudentRoutes = require("./src/routes/adminStudentRoutes");
const adminCompanyRoutes = require("./src/routes/adminCompanyRoutes");
const adminApplicationRoutes = require("./src/routes/adminApplicationRoutes");
const adminInterviewRoutes = require("./src/routes/adminInterviewRoutes");
const adminDashboardRoutes = require("./src/routes/adminDashboardRoutes");
const mockInterviewRoutes = require("./src/routes/mockInterviewRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/admin/students", adminStudentRoutes);
app.use("/api/admin/companies", adminCompanyRoutes);
app.use("/api/admin/applications", adminApplicationRoutes);
app.use("/api/admin/interviews", adminInterviewRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/mock-interviews", mockInterviewRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AI Recruitment Platform API is running",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server Error:", error.message);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message === "Only PDF files are allowed") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message === "Unexpected end of form") {
    return res.status(400).json({
      success: false,
      message: "File upload request was incomplete. Please try again.",
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

module.exports = app;