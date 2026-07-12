import { useEffect, useState } from "react";

// The animated trust score meter — the most visually distinctive
// part of InternSafe. Score fills up live as signals load.

const VERDICT_CONFIG = {
  SAFE: {
    color: "bg-green-500",
    textColor: "text-green-400",
    label: "SAFE",
    emoji: "✅",
    description: "This company shows strong legitimacy signals",
  },
  CAUTION: {
    color: "bg-yellow-500",
    textColor: "text-yellow-400",
    label: "CAUTION",
    emoji: "⚠️",
    description: "Some signals are unclear — proceed carefully",
  },
  RISKY: {
    color: "bg-red-500",
    textColor: "text-red-400",
    label: "HIGH RISK",
    emoji: "🚨",
    description: "Multiple red flags detected",
  },
  UNKNOWN: {
    color: "bg-gray-500",
    textColor: "text-gray-400",
    label: "UNKNOWN",
    emoji: "❓",
    description: "Not enough data to assess",
  },
};

export default function TrustMeter({ score, verdict, loading }) {
  const [displayScore, setDisplayScore] = useState(0);
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.UNKNOWN;

  // Animate score counting up
  useEffect(() => {
    if (!score) return;
    let start = 0;
    const duration = 1500;
    const increment = score / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  if (loading) {
    return (
      <div className="card text-center py-10">
        <div className="text-5xl mb-4 pulse-soft">🔍</div>
        <p className="text-gray-400 text-lg">Analysing signals...</p>
        <div className="mt-6 bg-gray-800 rounded-full h-3 overflow-hidden">
          <div className="bg-brand h-full rounded-full pulse-soft w-1/2" />
        </div>
      </div>
    );
  }

  if (!score && score !== 0) return null;

  return (
    <div className="card text-center">
      {/* Score circle */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#1f2937"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={
              verdict === "SAFE"
                ? "#22c55e"
                : verdict === "CAUTION"
                ? "#f59e0b"
                : verdict === "RISKY"
                ? "#ef4444"
                : "#6b7280"
            }
            strokeWidth="8"
            strokeDasharray={`${(displayScore / 100) * 251.2} 251.2`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.1s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold text-white">{displayScore}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>

      {/* Verdict badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-3 ${config.textColor} bg-gray-800`}>
        <span>{config.emoji}</span>
        <span>{config.label}</span>
      </div>

      <p className="text-gray-400 text-sm">{config.description}</p>
    </div>
  );
}
