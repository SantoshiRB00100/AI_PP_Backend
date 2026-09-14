const mongoose = require("mongoose");

const companyProfileSchema = new mongoose.Schema(
  {
    // Connects company profile to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    industry: {
      type: String,
      trim: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  
  {
    timestamps: true,
  }
);

const CompanyProfile = mongoose.model(
  "CompanyProfile",
  companyProfileSchema
);

module.exports = CompanyProfile;