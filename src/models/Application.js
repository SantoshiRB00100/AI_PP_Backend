const mongoose = require("mongoose");


const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;