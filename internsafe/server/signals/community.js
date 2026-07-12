const Report = require("../models/Report");

// Signal: Community Reports
// Has this company been flagged by other students?
// This is our network effect signal — gets stronger with every user.

async function checkCommunityReports(companyName) {
  try {
    const normalizedName = companyName.toLowerCase().trim();

    // Find all reports for this company in the last 6 months
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const reports = await Report.find({
      companyName: { $regex: normalizedName, $options: "i" },
      createdAt: { $gte: sixMonthsAgo },
    });

    const reportCount = reports.length;

    if (reportCount === 0) {
      return {
        name: "community",
        label: "Student Reports",
        score: 60, // neutral — no reports doesn't mean safe
        weight: 0.2,
        status: "unknown",
        reason: "No student reports found for this company",
        icon: "👥",
        detail: "Be the first to report if you have experience",
      };
    }

    // Categorize reports
    const reportTypes = reports.reduce((acc, r) => {
      acc[r.reportType] = (acc[r.reportType] || 0) + 1;
      return acc;
    }, {});

    const mostCommon = Object.entries(reportTypes).sort((a, b) => b[1] - a[1])[0];

    let score, status;

    if (reportCount >= 5) {
      score = 5;
      status = "risky";
    } else if (reportCount >= 3) {
      score = 20;
      status = "risky";
    } else if (reportCount >= 1) {
      score = 40;
      status = "caution";
    }

    const typeLabels = {
      fake_offer: "fake offer letters",
      no_stipend: "not paying stipends",
      ghosted: "ghosting interns",
      fake_company: "being a fake company",
      other: "misconduct",
    };

    return {
      name: "community",
      label: "Student Reports",
      score,
      weight: 0.2,
      status,
      reason: `${reportCount} student${reportCount > 1 ? "s" : ""} reported this company for ${typeLabels[mostCommon[0]] || "issues"} in the last 6 months`,
      icon: "👥",
      detail: `Report breakdown: ${Object.entries(reportTypes)
        .map(([k, v]) => `${v} ${typeLabels[k]}`)
        .join(", ")}`,
    };
  } catch (error) {
    return {
      name: "community",
      label: "Student Reports",
      score: 50,
      weight: 0.2,
      status: "unknown",
      reason: "Community database temporarily unavailable",
      icon: "👥",
    };
  }
}

module.exports = { checkCommunityReports };
