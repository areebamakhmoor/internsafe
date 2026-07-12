const axios = require("axios");

// Signal: Domain Age Check
// New domains (< 1 year) are a major red flag for scam companies.
// Real companies have domains that have existed for years.

async function checkDomain(companyNameOrUrl) {
  try {
    // Extract or guess the domain
    let domain = companyNameOrUrl.toLowerCase().trim();

    // If it looks like a URL, extract the domain
    if (domain.includes("http")) {
      domain = new URL(domain).hostname.replace("www.", "");
    } else {
      // Try to construct domain from company name
      domain = domain.replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") + ".com";
    }

    // Use WHOIS lookup via public API
    const response = await axios.get(
      `https://api.whoisfreaks.com/v1.0/whois?apiKey=${process.env.WHOIS_API_KEY}&whois=live&domainName=${domain}`,
      { timeout: 5000 }
    );

    const data = response.data;
    const createdDate = data?.create_date || data?.domain_registered_at;

    if (!createdDate) {
      return {
        name: "domain_age",
        label: "Domain Age",
        score: 40,
        weight: 0.15,
        status: "unknown",
        reason: "Could not determine domain registration date",
        icon: "🌐",
      };
    }

    const ageInDays =
      (Date.now() - new Date(createdDate).getTime()) / (1000 * 60 * 60 * 24);
    const ageInYears = ageInDays / 365;

    let score, status, reason;

    if (ageInYears >= 3) {
      score = 90;
      status = "safe";
      reason = `Domain registered ${Math.floor(ageInYears)} years ago — well-established`;
    } else if (ageInYears >= 1) {
      score = 65;
      status = "caution";
      reason = `Domain registered ${Math.floor(ageInYears)} year(s) ago — relatively new`;
    } else if (ageInDays >= 90) {
      score = 35;
      status = "risky";
      reason = `Domain only ${Math.floor(ageInDays)} days old — very new, proceed with caution`;
    } else {
      score = 10;
      status = "risky";
      reason = `Domain created just ${Math.floor(ageInDays)} days ago — major red flag`;
    }

    return {
      name: "domain_age",
      label: "Domain Age",
      score,
      weight: 0.15,
      status,
      reason,
      icon: "🌐",
      detail: `Registered: ${new Date(createdDate).toLocaleDateString("en-IN")}`,
    };
  } catch (error) {
    // If WHOIS fails, return neutral score — don't crash the whole verification
    return {
      name: "domain_age",
      label: "Domain Age",
      score: 40,
      weight: 0.15,
      status: "unknown",
      reason: "Domain lookup unavailable — check manually",
      icon: "🌐",
    };
  }
}

module.exports = { checkDomain };
