const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ],
      default: "applied",
    },

    // Rule-based skill matching
    matchPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    matchedSkills: [
      {
        type: String,
      },
    ],

    missingSkills: [
      {
        type: String,
      },
    ],

    // AI-based job matching
    aiMatch: {
      matchPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },

      summary: {
        type: String,
      },

      matchedSkills: [
        {
          type: String,
        },
      ],

      missingSkills: [
        {
          type: String,
        },
      ],

      relevantExperience: [
        {
          type: String,
        },
      ],

      relevantProjects: [
        {
          type: String,
        },
      ],

      educationMatch: {
        type: Boolean,
      },

      strengths: [
        {
          type: String,
        },
      ],

      weaknesses: [
        {
          type: String,
        },
      ],

      recommendations: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

module.exports = Application;