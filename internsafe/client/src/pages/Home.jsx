import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RECENT_SEARCHES = [
  "Internshala", "TCS iON", "Wipro", "Infosys BPM", "AI You Imagine"
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleVerify(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/verify", { query });
      navigate(`/result/${data._id}`, { state: data });
    } catch (err) {
      setError("Verification failed — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand text-sm px-4 py-1.5 rounded-full mb-6">
          <span>🛡️</span>
          <span>Trusted by students across India</span>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          Verify Before
          <span className="text-brand"> You Join</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Check if an internship or job offer is legitimate. Get a real-time
          trust score powered by AI, company data, and student reports.
        </p>
      </div>

      {/* Search box */}
      <form onSubmit={handleVerify} className="mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter company name or job posting URL..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors text-base"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary px-8"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Checking...
              </span>
            ) : (
              "Verify →"
            )}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2 ml-1">{error}</p>}
      </form>

      {/* Quick searches */}
      <div className="flex flex-wrap gap-2 mb-16">
        <span className="text-gray-500 text-sm py-1">Try:</span>
        {RECENT_SEARCHES.map((name) => (
          <button
            key={name}
            onClick={() => setQuery(name)}
            className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-lg transition-colors"
          >
            {name}
          </button>
        ))}
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: "🏛️",
            title: "Company Registration",
            desc: "Checks MCA India database for official company registration status",
          },
          {
            icon: "👥",
            title: "Student Reports",
            desc: "Real experiences from students who worked or applied there",
          },
          {
            icon: "🤖",
            title: "AI Offer Analysis",
            desc: "Paste your offer letter — AI scans it for red flags instantly",
          },
        ].map((item) => (
          <div key={item.title} className="card text-center">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-800 pt-10">
        {[
          { value: "500+", label: "Companies Verified" },
          { value: "1,200+", label: "Student Reports" },
          { value: "98%", label: "Accuracy Rate" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold text-brand">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
