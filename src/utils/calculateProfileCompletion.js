const calculateProfileCompletion = (profile) => {
  let completion = 0;

  // Full Name - 15%
  if (
    profile.fullName &&
    profile.fullName.trim() !== ""
  ) {
    completion += 15;
  }

  // Phone - 10%
  if (
    profile.phone &&
    profile.phone.trim() !== ""
  ) {
    completion += 10;
  }

  // Skills - 20%
  if (
    profile.skills &&
    profile.skills.length > 0
  ) {
    completion += 20;
  }

  // Education - 20%
  if (
    profile.education &&
    profile.education.college &&
    profile.education.degree &&
    profile.education.branch &&
    profile.education.cgpa !== undefined &&
    profile.education.graduationYear
  ) {
    completion += 20;
  }

  // Projects - 15%
  if (
    profile.projects &&
    profile.projects.length > 0
  ) {
    completion += 15;
  }

  // Resume - 20%
  if (
    profile.resume &&
    profile.resume.url
  ) {
    completion += 20;
  }

  return completion;
};

module.exports = calculateProfileCompletion;