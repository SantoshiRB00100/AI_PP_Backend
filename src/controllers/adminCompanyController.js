const User = require("../models/User");

// ==========================================
// GET ALL COMPANIES - ADMIN
// ==========================================

const getAllCompanies = async (req, res) => {
  try {
    const companies = await User.find({
      role: "company",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error("Get All Companies Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
    });
  }
};

// ==========================================
// ACTIVATE / DEACTIVATE COMPANY - ADMIN
// ==========================================

const updateCompanyStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    // Validate the value
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    // Find company
    const company = await User.findOne({
      _id: req.params.companyId,
      role: "company",
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Update company status
    company.isActive = isActive;

    await company.save();

    return res.status(200).json({
      success: true,
      message: isActive
        ? "Company activated successfully"
        : "Company deactivated successfully",
      company: {
        _id: company._id,
        email: company.email,
        role: company.role,
        isActive: company.isActive,
      },
    });
  } catch (error) {
    console.error("Update Company Status Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update company status",
    });
  }
};

module.exports = {
  getAllCompanies,
  updateCompanyStatus,
};