const axios = require("axios");

// Signal: LinkedIn Presence Check
// Real companies have LinkedIn pages with real employees.
// Scam companies either have no LinkedIn or tiny follower counts.
// We use Google's public search to check LinkedIn presence
// without needing the official LinkedIn API.

async function checkLinkedIn(companyName) {
  try {
    // Search for the company on LinkedIn via Google
    const searchQuery = encodeURIComponent(
      `site:linkedin.com/company "${companyName}"`
    );
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${searchQuery}`,
      { timeout: 5000 }
    );

    const results = response.data?.items || [];
    const hasLinkedIn = results.length > 0;

    if (!hasLinkedIn) {
      return {
        name: "linkedin",
        label: "LinkedIn Presence",
        score: 20,
        weight: 0.2,
        status: "risky",
        reason: `No LinkedIn company page found for "${companyName}" — unverified company`,
        icon: "💼",
      };
    }

    // Check if the result looks legitimate
    const topResult = results[0];
    const snippet = topResult.snippet || "";

    // Look for employee count indicators in snippet
    const hasEmployees =
      snippet.includes("employee") || snippet.includes("followers");

    return {
      name: "linkedin",
      label: "LinkedIn Presence",
      score: hasEmployees ? 80 : 55,
      weight: 0.2,
      status: hasEmployees ? "safe" : "caution",
      reason: hasEmployees
        ? `LinkedIn company page found with employee data`
        : `LinkedIn page found but limited information available`,
      icon: "💼",
      detail: topResult.link,
    };
  } catch (error) {
    // Fallback: if Google API not configured, do a basic check
    return {
      name: "linkedin",
      label: "LinkedIn Presence",
      score: 40,
      weight: 0.2,
      status: "unknown",
      reason: "LinkedIn check unavailable — verify manually at linkedin.com/company",
      icon: "💼",
    };
  }
}

module.exports = { checkLinkedIn };
