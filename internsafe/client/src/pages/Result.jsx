import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import TrustMeter from "../components/TrustMeter";
import SignalCard from "../components/SignalCard";
import OfferAnalyser from "../components/OfferAnalyser";

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // If user navigated directly to a shared link
    if (!data) {
      axios
        .get(`/api/verify/${id}`)
        .then((res) => setData(res.data))
        .catch(() => navigate("/"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-400 text-lg pulse-soft">Loading report...</p>
      </div>
    );
  }

  if (!data) return null;

  const verdictColors = {
    SAFE: "bg-green-500/10 border-green-500/30 text-green-400",
    CAUTION: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    RISKY: "bg-red-500/10 border-red-500/30 text-red-400",
    UNKNOWN: "bg-gray-800 border-gray-700 text-gray-400",
  };

  console.log(data);
    
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="text-gray-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition-colors"
      >
        ← Back to search
      </button>

      {/* Company name + share */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-gray-400 text-sm mb-1">Verification Report for</p>
          <h1 className="text-3xl font-bold text-white capitalize">
            {data.query}
          </h1>
          {data.cached && (
            <span className="text-xs text-gray-500 mt-1 block">
              ⚡ Cached result — verified within last 24 hours
            </span>
          )}
        </div>
        <button
          onClick={copyLink}
          className="flex-shrink-0 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-xl transition-colors"
        >
          {copied ? "✅ Copied!" : "🔗 Share"}
        </button>
      </div>

      {/* Trust Meter */}
      <div className="mb-6">
        <TrustMeter score={data.trustScore} verdict={data.verdict} />
      </div>

      {/* Recommendation banner */}
      <div
        className={`border rounded-xl p-4 mb-8 ${verdictColors[data.verdict]}`}
      >
        <p className="font-semibold mb-1">What should I do?</p>
        <p className="text-sm opacity-90">{data.recommendation}</p>
      </div>

      {/* Signal breakdown */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">
          Signal Breakdown
        </h2>
       <div className="space-y-3">
  {data.signals?.map((signal) => (
    <div
      key={signal.name}
      style={{
        border: "1px solid red",
        padding: "10px",
        marginBottom: "10px",
        color: "white",
      }}
    >
      {signal.label} - {signal.score}
    </div>
  ))}
</div>
      </div>

      {/* Report this company */}
      <div className="card mb-4">
        <h3 className="font-semibold text-white mb-2">
          Had an experience with this company?
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Help other students by reporting fake offers, missing stipends, or
          unprofessional behaviour.
        </p>
        <button
          onClick={() =>
            navigate("/report", { state: { company: data.query } })
          }
          className="btn-primary text-sm"
        >
          Report This Company
        </button>
      </div>

      {/* Offer letter analyser */}
      <OfferAnalyser />

      {/* Disclaimer */}
      <p className="text-gray-600 text-xs text-center mt-10">
        InternSafe provides informational analysis only. Always verify
        independently before accepting any offer. Trust scores are based on
        available data and community reports.
      </p>
    </main>
  );
}
