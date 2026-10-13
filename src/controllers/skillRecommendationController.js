
const getSkillRecommendations = async (req, res) => {
  try {
    const { role } = req.query;

    if (typeof role !== "string" || !role.trim()) {
      return res.status(400).json({
        message: "Please provide a role, such as Frontend Developer.",
      });
    }

    const resourceCatalogue = {
      JavaScript: {
        title: "JavaScript Guide",
        provider: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        level: "Beginner to Advanced",
      },
      React: {
        title: "Learn React",
        provider: "React Official Documentation",
        url: "https://react.dev/learn",
        level: "Beginner to Intermediate",
      },
      HTML: {
        title: "Learn HTML",
        provider: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
        level: "Beginner",
      },
      CSS: {
        title: "Learn CSS",
        provider: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
        level: "Beginner",
      },
      NodeJS: {
        title: "Node.js Learn",
        provider: "Node.js Official Documentation",
        url: "https://nodejs.org/en/learn",
        level: "Beginner to Advanced",
      },
      MongoDB: {
        title: "MongoDB University",
        provider: "MongoDB",
        url: "https://learn.mongodb.com/",
        level: "Beginner to Intermediate",
      },
      Java: {
        title: "Dev.java Tutorials",
        provider: "Oracle Java",
        url: "https://dev.java/learn/",
        level: "Beginner to Advanced",
      },
      Python: {
        title: "Python Tutorial",
        provider: "Python Official Documentation",
        url: "https://docs.python.org/3/tutorial/",
        level: "Beginner to Intermediate",
      },
      SQL: {
        title: "SQL Tutorial",
        provider: "SQLBolt",
        url: "https://sqlbolt.com/",
        level: "Beginner",
      },
      DataAnalysis: {
        title: "Data Analysis with Python",
        provider: "freeCodeCamp",
        url: "https://www.freecodecamp.org/learn/data-analysis-with-python/",
        level: "Beginner to Intermediate",
      },
      Testing: {
        title: "Selenium Documentation",
        provider: "Selenium",
        url: "https://www.selenium.dev/documentation/",
        level: "Beginner to Intermediate",
      },
      DevOps: {
        title: "Docker Get Started",
        provider: "Docker",
        url: "https://docs.docker.com/get-started/",
        level: "Beginner",
      },
      MachineLearning: {
        title: "Machine Learning Crash Course",
        provider: "Google",
        url: "https://developers.google.com/machine-learning/crash-course",
        level: "Beginner to Intermediate",
      },
      Android: {
        title: "Android Basics",
        provider: "Android Developers",
        url: "https://developer.android.com/courses",
        level: "Beginner",
      },
      Cybersecurity: {
        title: "Introduction to Cybersecurity",
        provider: "Cisco Networking Academy",
        url: "https://www.netacad.com/",
        level: "Beginner",
      },
      Networking: {
        title: "Networking Basics",
        provider: "Cisco Networking Academy",
        url: "https://www.netacad.com/",
        level: "Beginner",
      },
      DSA: {
        title: "Algorithms and Data Structures",
        provider: "VisuAlgo",
        url: "https://visualgo.net/en",
        level: "Beginner to Intermediate",
      },
    };

    const roleSkills = {
      "Frontend Developer": ["HTML", "CSS", "JavaScript", "React"],
      "JavaScript Developer": ["JavaScript", "HTML", "CSS", "React"],
      "Backend Developer": ["NodeJS", "JavaScript", "MongoDB", "SQL"],
      "Full Stack Developer": ["HTML", "CSS", "JavaScript", "React", "NodeJS", "MongoDB"],
      "Software Engineer": ["DSA", "Java", "SQL", "JavaScript"],
      "Java Developer": ["Java", "SQL", "DSA"],
      "Python Developer": ["Python", "SQL", "DSA"],
      "SQL Developer": ["SQL", "Python"],
      "Data Engineer": ["Python", "SQL", "DevOps"],
      "Data Analyst": ["SQL", "Python", "DataAnalysis"],
      "Data Scientist": ["Python", "SQL", "MachineLearning"],
      "AI/ML Engineer": ["Python", "MachineLearning", "SQL"],
      "QA Engineer": ["Testing", "JavaScript", "SQL"],
      "Software Tester": ["Testing", "SQL", "Java"],
      "Automation Test Engineer": ["Testing", "Java", "Python"],
      "DevOps Engineer": ["DevOps", "Networking", "Python"],
      "Cloud Engineer": ["DevOps", "Networking", "Python"],
      "Android Developer": ["Android", "Java", "Python"],
      "Mobile Developer": ["Android", "JavaScript", "React"],
      "Cybersecurity Analyst": ["Cybersecurity", "Networking", "Python"],
      "Security Engineer": ["Cybersecurity", "Networking", "Python"],
      "Network Engineer": ["Networking", "Cybersecurity", "Python"],
      "System Administrator": ["Networking", "DevOps", "Cybersecurity"],
      "DSA / Problem-Solving": ["DSA", "Java", "Python"],
    };

    const normalizedRole = role.trim();
    const skills = roleSkills[normalizedRole];

    if (!skills) {
      return res.status(400).json({
        message: "Unsupported role.",
        supportedRoles: Object.keys(roleSkills),
      });
    }

    const recommendations = skills.map((skill) => ({
      skill,
      ...resourceCatalogue[skill],
    }));

    return res.status(200).json({
      message: "Recommendations retrieved successfully.",
      role: normalizedRole,
      recommendations,
    });
  } catch (error) {
    console.error("Skill recommendation error:", error.message);

    return res.status(500).json({
      message: "Failed to retrieve skill recommendations.",
    });
  }
};

module.exports = {
  getSkillRecommendations,
};
