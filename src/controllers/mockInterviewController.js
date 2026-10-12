
const MockInterview = require("../models/MockInterview");
const StudentProfile = require("../models/StudentProfile");

const {
  generateMockInterviewQuestions,
  evaluateMockInterviewAnswers,
} = require("../services/aiService");

// Start a mock interview
const startMockInterview = async (req, res) => {
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

    const { role } = req.body;

    if (!role || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a job role",
      });
    }

    const questions = await generateMockInterviewQuestions(
      role.trim(),
      student.skills || []
    );

    const mockInterview = await MockInterview.create({
      student: student._id,
      role: role.trim(),
      questions: questions.map((item) => ({
        question: item.question,
      })),
    });

    return res.status(201).json({
      success: true,
      message: "Mock interview started successfully",
      mockInterview,
    });
  } catch (error) {
    console.error("Start mock interview error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to start mock interview",
    });
  }
};

// Submit answers and receive AI evaluation
const submitMockInterviewAnswers = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be provided as an array",
      });
    }

    const student = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const mockInterview = await MockInterview.findOne({
      _id: interviewId,
      student: student._id,
    });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview not found",
      });
    }

    const submittedAnswers = [];

    for (const item of answers) {
      if (
        !item.questionId ||
        typeof item.answer !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Each answer needs a questionId and answer",
        });
      }

      const question = mockInterview.questions.id(item.questionId);

      if (!question) {
        return res.status(400).json({
          success: false,
          message: `Invalid question ID: ${item.questionId}`,
        });
      }

      question.answer = item.answer.trim();

      if (question.answer) {
        submittedAnswers.push({
          questionId: question._id.toString(),
          question: question.question,
          answer: question.answer,
        });
      }
    }

    if (submittedAnswers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please answer at least one question",
      });
    }

    const evaluation = await evaluateMockInterviewAnswers(
      mockInterview.role,
      submittedAnswers
    );

    for (const result of evaluation.evaluations) {
      const question = mockInterview.questions.id(
        result.questionId
      );

      if (question) {
        question.score = result.score;
        question.feedback = result.feedback;
      }
    }

    const totalScore = evaluation.evaluations.reduce(
      (sum, item) => sum + item.score,
      0
    );

    mockInterview.overallScore = Math.round(
      (totalScore / evaluation.evaluations.length) * 10
    );

    mockInterview.overallFeedback =
      evaluation.overallFeedback;

    mockInterview.improvementSuggestions =
      evaluation.improvementSuggestions;

    await mockInterview.save();

    return res.status(200).json({
      success: true,
      message: "Answers evaluated successfully",
      result: mockInterview,
    });
  } catch (error) {
    console.error("Submit mock interview error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to evaluate answers",
    });
  }
};

// Get the logged-in student's mock interview history
const getMyMockInterviews = async (req, res) => {
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

    const mockInterviews = await MockInterview.find({
      student: student._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: mockInterviews.length,
      mockInterviews,
    });
  } catch (error) {
    console.error("Get mock interview history error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch mock interview history",
    });
  }
};

module.exports = {
  startMockInterview,
  submitMockInterviewAnswers,
  getMyMockInterviews,
};

