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