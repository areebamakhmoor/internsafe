const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/offer/analyse
// Body: { text: "full offer letter text" }
// Returns: AI analysis with red flags and green flags

router.post("/analyse", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 50) {
      return res
        .status(400)
        .json({ error: "Please paste the full offer letter text" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert at identifying fake and exploitative internship offer letters in India. 

Analyse this offer letter and return a JSON response with exactly this structure:
{
  "overallRisk": "LOW" | "MEDIUM" | "HIGH",
  "riskScore": 0-100 (0 = very safe, 100 = almost certainly fake),
  "redFlags": [
    { "flag": "description of red flag", "severity": "HIGH" | "MEDIUM" | "LOW" }
  ],
  "greenFlags": [
    { "flag": "description of positive signal" }
  ],
  "summary": "2-3 sentence plain English summary of your assessment",
  "missingElements": ["list of things a real offer letter should have but this one doesn't"]
}

Red flags to look for:
- No stipend or vague stipend terms
- No company address or registered office
- Asking for money, deposits, or fees
- No mention of company CIN or registration
- Vague role description
- No start/end dates
- No reporting manager named
- Grammatical errors or unprofessional language
- Asking for personal documents upfront
- Promises of certificates without work
- No contact information

Offer letter text:
${text}

Return ONLY the JSON object, no markdown, no explanation.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse AI response
    const analysis = JSON.parse(responseText);

    res.json(analysis);
  } catch (error) {
    console.error("Offer analysis error:", error);

    // If AI fails, return basic analysis
    res.status(500).json({
      error: "AI analysis temporarily unavailable",
      fallback: true,
      basicChecks: performBasicChecks(req.body.text),
    });
  }
});

// Basic rule-based checks as fallback if Gemini is unavailable
function performBasicChecks(text) {
  const lower = text.toLowerCase();
  const flags = [];

  if (!lower.includes("stipend") && !lower.includes("salary")) {
    flags.push("No mention of compensation");
  }
  if (!lower.includes("address") && !lower.includes("office")) {
    flags.push("No company address mentioned");
  }
  if (lower.includes("fee") || lower.includes("deposit") || lower.includes("pay")) {
    flags.push("Possible mention of fees — red flag");
  }
  if (!lower.includes("cin") && !lower.includes("registration")) {
    flags.push("No company registration number");
  }

  return flags;
}

module.exports = router;
