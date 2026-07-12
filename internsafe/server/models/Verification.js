const mongoose = require("mongoose");

// Cache verifications so we don't hit APIs repeatedly for same company
const verificationSchema = new mongoose.Schema(
  {
    query: { type: String, required: true, lowercase: true, trim: true },
    trustScore: { type: Number, required: true },
    signals: { type: Array, required: true },
    verdict: { type: String, enum: ["SAFE", "CAUTION", "RISKY", "UNKNOWN"] },
    // Cache expires after 24 hours
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

// Auto-delete expired cache entries
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Verification", verificationSchema);
