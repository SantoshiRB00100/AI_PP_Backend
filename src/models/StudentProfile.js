const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    // Connects this profile to a User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    education: {
      college: {
        type: String,
        trim: true,
      },

      degree: {
        type: String,
        trim: true,
      },

      branch: {
        type: String,
        trim: true,
      },

      cgpa: {
        type: Number,
        min: 0,
        max: 10,
      },

      graduationYear: {
        type: Number,
      },
    },

    projects: [
      {
        title: {
          type: String,
          trim: true,
        },

        description: {
          type: String,
        },

        technologies: [
          {
            type: String,
          },
        ],

        githubLink: {
          type: String,
        },

        liveLink: {
          type: String,
        },
      },
    ],

    resume: {
      url: {
        type: String,
      },

      fileName: {
        type: String,
      },
    },

    // AI Resume Analysis
    resumeAnalysis: {
      overallScore: {
        type: Number,
        default: 0,
      },

      summary: {
        type: String,
      },

      contact: {
        hasEmail: Boolean,
        hasPhone: Boolean,
        hasLinkedIn: Boolean,
        hasGitHub: Boolean,
        hasPortfolio: Boolean,
      },

      education: {
        present: Boolean,
        details: Array,
      },

      experience: {
        present: Boolean,
        details: Array,
      },

      skills: {
        programmingLanguages: Array,
        frontend: Array,
        backend: Array,
        databases: Array,
        tools: Array,
        concepts: Array,
      },

      projects: Array,

      strengths: Array,

      weaknesses: Array,

      missingSections: Array,

      atsAnalysis: {
        score: Number,
        issues: Array,
        suggestions: Array,
      },

      improvementSuggestions: Array,
    },

    profileCompletion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);

module.exports = StudentProfile;