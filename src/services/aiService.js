
const LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions";
const LM_STUDIO_MODEL = "qwen/qwen3-4b-2507";

// ==========================================
// HELPER FUNCTION
// ==========================================

const askLocalAI = async (prompt) => {
  const response = await fetch(LM_STUDIO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: LM_STUDIO_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LM Studio request failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("LM Studio returned an empty response");
  }

  return content;
};

// ==========================================
// JSON PARSER
// ==========================================

const parseAIJson = (output) => {
  const cleaned = output
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};

// ==========================================
// AI RESUME ANALYSIS
// ==========================================

const analyzeResumeWithAI = async (resumeText) => {
  const output = await askLocalAI(`
You are an expert resume analyzer for a campus placement portal.

Analyze the entire resume, including contact information, summary,
education, experience, skills, projects, ATS readiness, strengths,
weaknesses, missing sections, and improvement suggestions.

Return only valid JSON. Do not use Markdown.

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
- Scores must be between 0 and 100.
- Do not invent information absent from the resume.
- Set education.present and experience.present to true when their
  respective sections contain actual resume information.
- Give practical suggestions for software developer placements.

RESUME:
${resumeText}
`);

  return parseAIJson(output);
};

// ==========================================
// AI JOB MATCHING
// ==========================================

const matchResumeWithJob = async (resumeText, jobDescription) => {
  const output = await askLocalAI(`
You are an AI job matching assistant for a campus placement portal.

Compare the student's resume with the job description.
Analyze suitability, matching and missing skills, relevant experience,
projects, education, strengths, weaknesses, and recommendations.

Return only valid JSON. Do not use Markdown.
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
- Use only information supported by the resume and job description.
- Do not invent skills, experience, projects, or education.

STUDENT RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`);

  return parseAIJson(output);
};

// ==========================================
// AI MOCK INTERVIEW QUESTIONS
// ==========================================

const generateMockInterviewQuestions = async (role, studentSkills = []) => {
  const prompt = `
You are an experienced technical interviewer.

Generate exactly 30 unique technical interview questions for this role:
${role}

Candidate skills:
${studentSkills.length ? studentSkills.join(", ") : "Not provided"}

Requirements:
1. Generate exactly 30 questions.
2. Cover beginner, intermediate, and advanced difficulty.
3. Include concepts, practical coding, debugging, and real-world scenarios.
4. Avoid duplicate questions.
5. Return only valid JSON, without Markdown.

Format:
{
  "questions": ["Question 1", "Question 2"]
}

The questions array must contain exactly 30 strings.
`;

  const parsed = parseAIJson(await askLocalAI(prompt));

  if (
    !Array.isArray(parsed.questions) ||
    parsed.questions.length < 30
  ) {
    throw new Error(
      "AI did not generate at least 30 interview questions. Please try again."
    );
  }

  return parsed.questions.slice(0, 30);
};

// ==========================================
// AI MOCK INTERVIEW ANSWER EVALUATION
// ==========================================

const evaluateMockInterviewAnswers = async (role, answers) => {
  const prompt = `
You are a fair technical interviewer evaluating a student's mock
interview answers for the role: ${role}.

Evaluate every submitted answer based on:
- Technical correctness
- Understanding of the concept
- Completeness and relevance
- Practical reasoning where applicable

Important rules:
1. Evaluate each answer fairly for a student applying for this role.
2. A short answer can receive a high score if it is correct and complete.
3. Do not penalize grammar heavily if the technical meaning is clear.
4. Do not invent claims about what the student said.
5. Give specific, constructive feedback for each answer.
6. Score each answer from 0 to 10.
7. An empty or irrelevant answer should receive a low score.
8. Include every supplied questionId exactly once.
9. overallFeedback should summarize the candidate's performance.
10. Provide practical improvementSuggestions.
11. Return only valid JSON, without Markdown.

Return exactly this structure:
{
  "evaluations": [
    {
      "questionId": "provided question ID",
      "score": 0,
      "feedback": "Specific feedback and what could be improved"
    }
  ],
  "overallFeedback": "Summary of the candidate's performance",
  "improvementSuggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ]
}

Evaluate the following submitted answers:
${JSON.stringify(answers)}
`;

  const parsed = parseAIJson(await askLocalAI(prompt));

  if (!Array.isArray(parsed.evaluations)) {
    throw new Error("AI returned an invalid answer evaluation.");
  }

  const submittedIds = new Set(answers.map((item) => item.questionId));
  const evaluatedIds = new Set();

  for (const evaluation of parsed.evaluations) {
    if (
      !submittedIds.has(evaluation.questionId) ||
      evaluatedIds.has(evaluation.questionId)
    ) {
      throw new Error(
        "AI returned invalid or duplicate question IDs during evaluation."
      );
    }

    const score = Number(evaluation.score);

    if (
      !Number.isFinite(score) ||
      score < 0 ||
      score > 10 ||
      typeof evaluation.feedback !== "string"
    ) {
      throw new Error("AI returned an invalid score or feedback.");
    }

    evaluatedIds.add(evaluation.questionId);
  }

  if (evaluatedIds.size !== submittedIds.size) {
    throw new Error(
      "AI did not evaluate every submitted answer. Please try again."
    );
  }

  return {
    evaluations: parsed.evaluations,
    overallFeedback:
      typeof parsed.overallFeedback === "string"
        ? parsed.overallFeedback
        : "Review your individual feedback to improve.",
    improvementSuggestions: Array.isArray(parsed.improvementSuggestions)
      ? parsed.improvementSuggestions
      : [],
  };
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  analyzeResumeWithAI,
  matchResumeWithJob,
  generateMockInterviewQuestions,
  evaluateMockInterviewAnswers,
};


