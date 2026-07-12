const express = require("express");
const router = express.Router();
const { checkMCA } = require("../signals/mca");
const { checkDomain } = require("../signals/domain");
const { checkLinkedIn } = require("../signals/linkedin");
const { checkCommunityReports } = require("../signals/community");
const { calculateTrustScore, getVerdictDetails } = require("../fusion");
const Verification = require("../models/Verification");

// POST /api/verify
// Body: { query: "Company Name or URL" }
// Returns: trust score + all signal results

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: "Please enter a company name" });
    }

    const normalizedQuery = query.trim().toLowerCase();

    // Check cache first — don't hit APIs for same company twice
    const cached = await Verification.findOne({ query: normalizedQuery });
    if (cached) {
      return res.json({
        ...cached.toObject(),
        cached: true,
      });
    }

    // Run all signals in parallel — faster than sequential
    // If one fails, others still complete (Promise.allSettled)
    const [mcaResult, domainResult, linkedinResult, communityResult] =
      await Promise.allSettled([
        checkMCA(query),
        checkDomain(query),
        checkLinkedIn(query),
        checkCommunityReports(query),
      ]);

    // Extract results — use fallback if a signal threw
    const signals = [
      mcaResult.status === "fulfilled"
        ? mcaResult.value
        : fallbackSignal("mca_registration", "MCA Registration", "🏛️", 0.25),
      domainResult.status === "fulfilled"
        ? domainResult.value
        : fallbackSignal("domain_age", "Domain Age", "🌐", 0.15),
      linkedinResult.status === "fulfilled"
        ? linkedinResult.value
        : fallbackSignal("linkedin", "LinkedIn Presence", "💼", 0.2),
      communityResult.status === "fulfilled"
        ? communityResult.value
        : fallbackSignal("community", "Student Reports", "👥", 0.2),
    ];

    const trustScore = calculateTrustScore(signals);
    const { verdict, summary, recommendation } = getVerdictDetails(
      trustScore,
      signals
    );

    // Cache result
    const verification = await Verification.create({
      query: normalizedQuery,
      trustScore,
      signals,
      verdict,
    });

    res.json({
      query,
      trustScore,
      verdict,
      summary,
      recommendation,
      signals,
      _id: verification._id,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Verification failed — please try again" });
  }
});

// GET /api/verify/:id — get a shareable report by ID
router.get("/:id", async (req, res) => {
  try {
    const verification = await Verification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json(verification);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

function fallbackSignal(name, label, icon, weight) {
  return {
    name,
    label,
    score: 40,
    weight,
    status: "unknown",
    reason: "Signal check failed — verify manually",
    icon,
  };
}

module.exports = router;
