
const MockInterview = require("../models/MockInterview");
const StudentProfile = require("../models/StudentProfile");
const {
  generateMockInterviewQuestions,
  evaluateMockInterviewAnswers,
} = require("../services/aiService");

// ==========================================
// START MOCK INTERVIEW
// ==========================================

const startMockInterview = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
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

    const questions = await generateMockInterviewQuestions(
      role.trim(),
      student.skills || []
    );

    const mockInterview = await MockInterview.create({
      student: student._id,
      role: role.trim(),
      questions: questions.map((question) => ({
        question,
      })),
    });

    return res.status(201).json({
      success: true,
      message: "Mock interview started successfully",
      mockInterview,
    });
  } catch (error) {
    console.error("Start Mock Interview Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to start mock interview",
    });
  }
};

// ==========================================
// SUBMIT ANSWERS AND GET AI EVALUATION
// ==========================================

const submitMockInterviewAnswers = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please submit at least one answer",
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

    // Validate submitted question IDs and save answers.
    for (const item of answers) {
      if (
        !item.questionId ||
        typeof item.answer !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Each answer must contain questionId and answer",
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
    }

    const answeredQuestions = mockInterview.questions.filter(
      (question) => question.answer.trim().length > 0
    );

    if (answeredQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one non-empty answer",
      });
    }

    const evaluation = await evaluateMockInterviewAnswers(
      mockInterview.role,
      answeredQuestions.map((question) => ({
        questionId: question._id.toString(),
        question: question.question,
        answer: question.answer,
      }))
    );

    if (
      !evaluation ||
      !Array.isArray(evaluation.evaluations)
    ) {
      throw new Error("AI returned an invalid evaluation");
    }

    for (const result of evaluation.evaluations) {
      const question = mockInterview.questions.id(result.questionId);

      if (!question) continue;

      const score = Number(result.score);

      question.score = Number.isFinite(score)
        ? Math.max(0, Math.min(10, score))
        : 0;

      question.feedback =
        typeof result.feedback === "string"
          ? result.feedback
          : "No feedback provided.";
    }

    // Calculate the overall score out of 100.
    const evaluatedQuestions = answeredQuestions
      .map((question) => mockInterview.questions.id(question._id))
      .filter((question) => question && question.feedback);

    const totalScore = evaluatedQuestions.reduce(
      (sum, question) => sum + question.score,
      0
    );

    mockInterview.overallScore =
      evaluatedQuestions.length > 0
        ? Math.round(
            (totalScore / (evaluatedQuestions.length * 10)) * 100
          )
        : 0;

    mockInterview.overallFeedback =
      typeof evaluation.overallFeedback === "string"
        ? evaluation.overallFeedback
        : "Review the individual feedback to improve your answers.";

    mockInterview.improvementSuggestions =
      Array.isArray(evaluation.improvementSuggestions)
        ? evaluation.improvementSuggestions
        : [];

    await mockInterview.save();

    return res.status(200).json({
      success: true,
      message: "Answers evaluated successfully",
      result: mockInterview,
    });
  } catch (error) {
    console.error("Submit Mock Interview Answers Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to evaluate answers",
    });
  }
};

module.exports = {
  startMockInterview,
  submitMockInterviewAnswers,
};
