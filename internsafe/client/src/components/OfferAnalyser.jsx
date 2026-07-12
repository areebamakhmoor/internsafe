import { useState } from "react";
import axios from "axios";

export default function OfferAnalyser() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyse() {
    if (text.trim().length < 50) {
      setError("Please paste the full offer letter text");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await axios.post("/api/offer/analyse", { text });
      setResult(data);
    } catch (err) {
      setError("Analysis failed — please try again");
    } finally {
      setLoading(false);
    }
  }

  const riskColors = {
    LOW: "text-green-400 bg-green-500/10",
    MEDIUM: "text-yellow-400 bg-yellow-500/10",
    HIGH: "text-red-400 bg-red-500/10",
  };

  return (
    <div className="card mt-8">
      <h2 className="text-xl font-bold text-white mb-2">
        🤖 AI Offer Letter Analyser
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Paste your offer letter text below. Our AI will scan for red flags,
        missing elements, and suspicious clauses.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your offer letter text here..."
        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-100 text-sm placeholder-gray-500 resize-none focus:outline-none focus:border-brand transition-colors"
        rows={8}
      />

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      <button
        onClick={handleAnalyse}
        disabled={loading || text.trim().length < 50}
        className="btn-primary mt-4 w-full"
      >
        {loading ? "Analysing..." : "Analyse Offer Letter"}
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Risk score */}
          <div
            className={`flex items-center justify-between p-4 rounded-xl ${riskColors[result.overallRisk]}`}
          >
            <span className="font-semibold">Overall Risk</span>
            <span className="font-bold text-lg">{result.overallRisk}</span>
          </div>

          <p className="text-gray-300 text-sm">{result.summary}</p>

          {/* Red flags */}
          {result.redFlags?.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-400 mb-2">
                🚨 Red Flags ({result.redFlags.length})
              </h3>
              <div className="space-y-2">
                {result.redFlags.map((flag, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm bg-red-500/5 border border-red-500/20 rounded-lg p-3"
                  >
                    <span className="text-red-400 flex-shrink-0">⚠️</span>
                    <span className="text-gray-300">{flag.flag}</span>
                    <span
                      className={`ml-auto flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
                        flag.severity === "HIGH"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {flag.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Green flags */}
          {result.greenFlags?.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-400 mb-2">
                ✅ Positive Signals ({result.greenFlags.length})
              </h3>
              <div className="space-y-2">
                {result.greenFlags.map((flag, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm bg-green-500/5 border border-green-500/20 rounded-lg p-3"
                  >
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span className="text-gray-300">{flag.flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing elements */}
          {result.missingElements?.length > 0 && (
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">
                📋 Missing Elements
              </h3>
              <ul className="space-y-1">
                {result.missingElements.map((el, i) => (
                  <li key={i} className="text-sm text-gray-400 flex gap-2">
                    <span className="text-yellow-400">•</span> {el}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
