const mongoose = require("mongoose");

// One report = one student flagging one company
const reportSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    reportType: {
      type: String,
      enum: ["fake_offer", "no_stipend", "ghosted", "fake_company", "other"],
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    // We don't store emails — just a hash so one person can't spam
    reporterHash: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
