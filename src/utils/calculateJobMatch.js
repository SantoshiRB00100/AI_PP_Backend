const normalizeSkill = (skill) => {
  return skill
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\.(js|jsx|ts|tsx)$/g, "$1")
    .replace(/\.js$/g, "")
    .replace(/\.jsx$/g, "")
    .replace(/\.ts$/g, "")
    .replace(/\.tsx$/g, "");
};

const calculateJobMatch = (resumeSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const normalizedResumeSkills = resumeSkills.map(normalizeSkill);

  const normalizedRequiredSkills = requiredSkills.map(normalizeSkill);

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