const axios = require("axios");

// Signal: MCA Company Registration
// Every legitimate Indian company must be registered with the
// Ministry of Corporate Affairs (MCA). If a company doesn't
// exist in the MCA database, it's either a sole proprietorship,
// partnership, or — most likely in the internship context — fake.

// MCA21 has a public search portal. We use it to verify.
// Note: The official MCA API requires registration. We use
// their public search endpoint which is freely accessible.

async function checkMCA(companyName) {
  try {
    // MCA public search — this hits their public search endpoint
    const response = await axios.get(
      `https://efiling.mca.gov.in/DownloadDocument/masterDataDownloadServlet?companyName=${encodeURIComponent(companyName)}&companyStatus=&stateCode=&category=&subCategory=&classOfCompany=&age=&rrn=`,
      {
        timeout: 8000,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      }
    );

    const data = response.data;

    // MCA returns company records if found
    if (data && data.length > 0) {
      const company = data[0];
      const status = company.company_status || "Unknown";
      const isActive = status.toLowerCase().includes("active");

      return {
        name: "mca_registration",
        label: "MCA Registration",
        score: isActive ? 85 : 40,
        weight: 0.25,
        status: isActive ? "safe" : "caution",
        reason: isActive
          ? `Registered with MCA India — status: ${status}`
          : `Found in MCA records but status is: ${status}`,
        icon: "🏛️",
        detail: company.cin ? `CIN: ${company.cin}` : null,
      };
    }

    // Not found in MCA — this is a significant red flag
    return {
      name: "mca_registration",
      label: "MCA Registration",
      score: 15,
      weight: 0.25,
      status: "risky",
      reason: `"${companyName}" not found in MCA India database — company may be unregistered`,
      icon: "🏛️",
      detail: "Verify manually at mcaservices.mca.gov.in/mcafoportal/viewCompanyMasterData.do",
    };
  } catch (error) {
    // MCA API can be slow/down — return neutral with manual check link
    return {
      name: "mca_registration",
      label: "MCA Registration",
      score: 40,
      weight: 0.25,
      status: "unknown",
      reason: "MCA database check unavailable — verify manually",
      icon: "🏛️",
      detail: "Check at: mcaservices.mca.gov.in",
    };
  }
}

module.exports = { checkMCA };
