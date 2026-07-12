import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const REPORT_TYPES = [
  { value: "fake_offer", label: "🚨 Fake offer letter" },
  { value: "no_stipend", label: "💸 Didn't pay stipend" },
  { value: "ghosted", label: "👻 Ghosted after selection" },
  { value: "fake_company", label: "🏚️ Company doesn't exist" },
  { value: "other", label: "📝 Other issue" },
];

export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: location.state?.company || "",
    reportType: "",
    description: "",
    reporterIdentifier: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.companyName || !form.reportType) {
      setError("Company name and report type are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/reports", form);
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You have already reported this company");
      } else {
        setError("Failed to submit report — please try again");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Report Submitted
        </h2>
        <p className="text-gray-400 mb-8">
          Thank you for helping other students stay safe. Your report has been
          recorded and will appear in future verifications of this company.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Verify Another Company
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition-colors"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-white mb-2">
        Report a Company
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Help other students by anonymously reporting fake internships and
        exploitative companies. Your identity is never stored.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company Name *
          </label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="e.g. XYZ Innovations Pvt Ltd"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        {/* Report type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What happened? *
          </label>
          <div className="grid grid-cols-1 gap-2">
            {REPORT_TYPES.map((type) => (
              <label
                key={type.value}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  form.reportType === type.value
                    ? "border-brand bg-brand/10 text-white"
                    : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="reportType"
                  value={type.value}
                  checked={form.reportType === type.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tell us more (optional)
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What happened? The more detail you share, the more it helps others..."
            rows={4}
            maxLength={500}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors resize-none text-sm"
          />
          <p className="text-gray-600 text-xs mt-1 text-right">
            {form.description.length}/500
          </p>
        </div>

        {/* Optional identifier for dedup */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your college email (optional — only used to prevent duplicate reports)
          </label>
          <input
            name="reporterIdentifier"
            value={form.reporterIdentifier}
            onChange={handleChange}
            placeholder="yourname@college.edu"
            type="email"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors text-sm"
          />
          <p className="text-gray-600 text-xs mt-1">
            🔒 We store only a hashed version — your email is never saved
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !form.companyName || !form.reportType}
          className="btn-primary w-full"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </main>
  );
}
