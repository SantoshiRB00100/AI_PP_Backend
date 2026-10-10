const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema(
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

        answer: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
          min: 0,
          max: 10,
        },

        feedback: {
          type: String,
          default: "",
        },
      },
    ],

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    overallFeedback: {
      type: String,
      default: "",
    },

    improvementSuggestions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MockInterview = mongoose.model(
  "MockInterview",
  mockInterviewSchema
);

module.exports = MockInterview;