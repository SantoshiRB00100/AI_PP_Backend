const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// ==========================================
// AI RESUME ANALYSIS
// ==========================================

const analyzeResumeWithAI = async (resumeText) => {
  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",

    input: `
You are an expert resume analyzer for a campus placement portal.

Analyze the ENTIRE resume, not just technical skills.

Evaluate:
- Contact information
- Professional summary
- Education
- Work experience/internship
- Technical skills
- Projects
- Resume content quality
- ATS readiness
- Strengths
- Weaknesses
- Missing sections
- Improvement suggestions

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "summary": "",
  "contact": {
    "hasEmail": false,
    "hasPhone": false,
    "hasLinkedIn": false,
    "hasGitHub": false,
    "hasPortfolio": false
  },
  "education": {
    "present": false,
    "details": []
  },
  "experience": {
    "present": false,
    "details": []
  },
  "skills": {
    "programmingLanguages": [],
    "frontend": [],
    "backend": [],
    "databases": [],
    "tools": [],
    "concepts": []
  },
  "projects": [],
  "strengths": [],
  "weaknesses": [],
  "missingSections": [],
  "atsAnalysis": {
    "score": 0,
    "issues": [],
    "suggestions": []
  },
  "improvementSuggestions": []
}

Rules:
- overallScore must be between 0 and 100.
- atsAnalysis.score must be between 0 and 100.
- Do not invent information that is not present in the resume.
- If a section is missing, mention it appropriately.
- Analyze the actual resume content carefully.
- Give practical suggestions useful for a student applying for software developer placements.

Resume:
${resumeText}
`,
  });

  const aiAnalysis = JSON.parse(interaction.output_text);

  return aiAnalysis;
};


// ==========================================
// AI JOB MATCHING
// ==========================================

const matchResumeWithJob = async (resumeText, jobDescription) => {
  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",

    input: `
You are an AI job matching assistant for a campus placement portal.

Compare the student's resume with the given job description.

Analyze:
- Overall suitability
- Required skills
- Matching skills
- Missing skills
- Relevant experience
- Relevant projects
- Education requirements
- Strengths for this job
- Weaknesses for this job
- Practical recommendations

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

Use exactly this structure:

{
  "matchPercentage": 0,
  "summary": "",
  "matchedSkills": [],
  "missingSkills": [],
  "relevantExperience": [],
  "relevantProjects": [],
  "educationMatch": true,
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}

Rules:
- matchPercentage must be between 0 and 100.
- Only consider information actually present in the resume.
- Do not invent skills, experience, projects, or education.
- Compare the resume carefully with the actual job description.
- Give practical recommendations for the student.

STUDENT RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`,
  });

  const aiMatchResult = JSON.parse(interaction.output_text);

  return aiMatchResult;
};


module.exports = {
  analyzeResumeWithAI,
  matchResumeWithJob,
};