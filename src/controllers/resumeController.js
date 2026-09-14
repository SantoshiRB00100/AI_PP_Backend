const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");

const { analyzeResumeWithAI } = require("../services/aiService");
const StudentProfile = require("../models/StudentProfile");
const extractSkills = require("../utils/extractSkills");
const calculateJobMatch = require("../utils/calculateJobMatch");

const analyzeResume = async (req, res) => {
  try {
    // Find logged-in student's profile
    const profile = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Check whether resume exists
    if (!profile.resume || !profile.resume.url) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume first",
      });
    }

    // Create actual file path
    const filePath = path.join(
      process.cwd(),
      profile.resume.url.replace(/^\/+/, "")
    );

    // Read PDF file
    const dataBuffer = fs.readFileSync(filePath);

    // Create PDF parser
    const parser = new PDFParse({
      data: dataBuffer,
    });

    // Extract text
    const pdfData = await parser.getText();

    // Analyze entire resume using Gemini AI
    const aiResult = await analyzeResumeWithAI(pdfData.text);

    // Extract skills using our utility
    const extractedSkills = extractSkills(pdfData.text);

    // Save AI analysis to student profile
    profile.resumeAnalysis = aiResult;

    // Save extracted skills to student profile
    profile.skills = extractedSkills;

    await profile.save();

    // Clean up parser
    await parser.destroy();

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      extractedText: pdfData.text,
      aiAnalysis: aiResult,
      extractedSkills,
    });
  } catch (error) {
    console.error("Resume Analysis Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze resume",
    });
  }
};


// Get previously saved resume analysis
const getResumeAnalysis = async (req, res) => {
  try {
    // Find logged-in student's profile
    const profile = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Check whether analysis exists
    if (!profile.resumeAnalysis) {
      return res.status(404).json({
        success: false,
        message: "Resume analysis not found. Please analyze your resume first.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume analysis fetched successfully",
      resumeAnalysis: profile.resumeAnalysis,
    });
  } catch (error) {
    console.error("Get Resume Analysis Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume analysis",
    });
  }
};


module.exports = {
  analyzeResume,
  getResumeAnalysis,
};