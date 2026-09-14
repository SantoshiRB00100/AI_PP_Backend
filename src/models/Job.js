const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Internship",
        "Contract",
      ],
      default: "Full Time",
    },

    salary: {
      min: {
        type: Number,
      },

      max: {
        type: Number,
      },
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    minimumCGPA: {
      type: Number,
      min: 0,
      max: 10,
    },

    aiMatchThreshold: {
      type: Number,
      min: 0,
      max: 100,
      default: 60,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "closed",
      ],
      default: "pending",
    },

    applicationDeadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;