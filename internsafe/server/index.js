const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "10mb" })); // large limit for offer letter text

// Routes
app.use("/api/verify", require("./routes/verify"));
app.use("/api/offer", require("./routes/offer"));
app.use("/api/reports", require("./routes/reports"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "InternSafe API running", version: "1.0.0" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
