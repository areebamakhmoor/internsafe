// Fusion Engine
// Combines all signal scores into one Trust Score (0-100)
// Same concept as Sherlock — weighted average of multiple signals

function calculateTrustScore(signals) {
  if (!signals || signals.length === 0) return 0;

  const totalWeight = signals.reduce((sum, s) => sum + (s.weight || 0), 0);
  if (totalWeight === 0) return 0;

  const weightedSum = signals.reduce(
    (sum, s) => sum + (s.score || 0) * (s.weight || 0),
    0
  );

  return Math.round(weightedSum / totalWeight);
}

function getVerdict(score) {
  if (score >= 75) return "SAFE";
  if (score >= 50) return "CAUTION";
  if (score >= 25) return "RISKY";
  return "UNKNOWN";
}

function getVerdictDetails(score, signals) {
  const verdict = getVerdict(score);

  const riskySignals = signals.filter((s) => s.status === "risky");
  const cautionSignals = signals.filter((s) => s.status === "caution");

  let summary = "";
  let recommendation = "";

  switch (verdict) {
    case "SAFE":
      summary = "This company shows strong legitimacy signals";
      recommendation =
        "Looks legitimate — still verify the offer letter before signing";
      break;
    case "CAUTION":
      summary = "Some signals are unclear — proceed carefully";
      recommendation =
        "Research further before accepting. Ask for a video call with HR and verify the company address";
      break;
    case "RISKY":
      summary = `${riskySignals.length} major red flag${riskySignals.length > 1 ? "s" : ""} detected`;
      recommendation =
        "High risk of fraud. Do not pay any fees. Do not share personal documents until fully verified";
      break;
    default:
      summary = "Not enough data to assess this company";
      recommendation =
        "Verify manually — check MCA, LinkedIn, and ask seniors about this company";
  }

  return { verdict, summary, recommendation };
}

module.exports = { calculateTrustScore, getVerdict, getVerdictDetails };
