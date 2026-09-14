const calculateJobMatch = (resumeSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const normalizedResumeSkills = resumeSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  const normalizedRequiredSkills = requiredSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  const matchedSkills = normalizedRequiredSkills.filter((skill) =>
    normalizedResumeSkills.includes(skill)
  );

  const missingSkills = normalizedRequiredSkills.filter(
    (skill) => !normalizedResumeSkills.includes(skill)
  );

  const matchPercentage = Math.round(
    (matchedSkills.length / normalizedRequiredSkills.length) * 100
  );

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
  };
};

module.exports = calculateJobMatch;