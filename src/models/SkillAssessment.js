
const mongoose = require("mongoose");

const skillAssessmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        options: {
          type: [String],
          required: true,
        },

        correctAnswer: {
          type: String,
          required: true,
        },

        explanation: {
          type: String,
          default: "",
        },

        selectedAnswer: {
          type: String,
          default: "",
        },
      },
    ],

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SkillAssessment",
  skillAssessmentSchema
);
