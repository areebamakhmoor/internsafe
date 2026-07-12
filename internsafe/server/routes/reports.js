const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Report = require("../models/Report");

// POST /api/reports — submit a new report
router.post("/", async (req, res) => {
  try {
    const { companyName, reportType, description, reporterIdentifier } =
      req.body;

    if (!companyName || !reportType) {
      return res
        .status(400)
        .json({ error: "Company name and report type are required" });
    }

    // Hash the identifier so we store nothing personal
    const reporterHash = crypto
      .createHash("sha256")
      .update(reporterIdentifier || req.ip)
      .digest("hex");

    // Prevent duplicate reports from same person for same company
    const existing = await Report.findOne({
      companyName: companyName.toLowerCase(),
      reporterHash,
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "You have already reported this company" });
    }

    const report = await Report.create({
      companyName: companyName.toLowerCase().trim(),
      reportType,
      description,
      reporterHash,
    });

    res.status(201).json({
      message: "Report submitted — thank you for helping other students",
      reportId: report._id,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit report" });
  }
});

// GET /api/reports/recent — get recent reports for homepage
router.get("/recent", async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("companyName reportType createdAt upvotes");

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// GET /api/reports/:company — get reports for a specific company
router.get("/:company", async (req, res) => {
  try {
    const reports = await Report.find({
      companyName: { $regex: req.params.company, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .select("reportType description createdAt upvotes");

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

module.exports = router;
