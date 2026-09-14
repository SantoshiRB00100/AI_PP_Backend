const skillDatabase = [
  "javascript",
  "react",
  "node.js",
  "nodejs",
  "express",
  "express.js",
  "mongodb",
  "mysql",
  "sql",
  "java",
  "python",
  "c++",
  "c",
  "html",
  "css",
  "tailwind css",
  "bootstrap",
  "git",
  "github",
  "rest api",
  "restful api",
  "jwt",
  "docker",
  "aws",
  "typescript",
  "next.js",
  "nextjs",
  "spring boot",
  "hibernate",
  "mongoose",
];

const extractSkills = (text) => {
  const lowerCaseText = text.toLowerCase();

  const foundSkills = [];

  skillDatabase.forEach((skill) => {
    if (skill === "c") {
      // Match C only as a separate word
      const cPattern = /\bc\b/;

      if (cPattern.test(lowerCaseText)) {
        foundSkills.push(skill);
      }
    } else {
      if (lowerCaseText.includes(skill)) {
        foundSkills.push(skill);
      }
    }
  });

  return [...new Set(foundSkills)];
};

module.exports = extractSkills;