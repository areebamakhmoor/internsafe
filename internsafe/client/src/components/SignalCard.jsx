// One signal card — shows the icon, label, score bar,
// status badge, and the plain-English reason.

const STATUS_COLORS = {
  safe: "text-green-400 border-green-500/30 bg-green-500/5",
  caution: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5",
  risky: "text-red-400 border-red-500/30 bg-red-500/5",
  unknown: "text-gray-400 border-gray-600/30 bg-gray-800/30",
};

const STATUS_LABELS = {
  safe: "✅ Safe",
  caution: "⚠️ Caution",
  risky: "🚨 Risk",
  unknown: "❓ Unknown",
};

const BAR_COLORS = {
  safe: "bg-green-500",
  caution: "bg-yellow-500",
  risky: "bg-red-500",
  unknown: "bg-gray-500",
};

export default function SignalCard({ signal, index }) {
  const colorClass = STATUS_COLORS[signal.status] || STATUS_COLORS.unknown;
  const barColor = BAR_COLORS[signal.status] || BAR_COLORS.unknown;

  return (
    <div
      className={`border rounded-xl p-4 ${colorClass}`}
      style={{
        animationDelay: `${index * 150}ms`,
        animation: "fadeInUp 0.4s ease forwards",
        opacity: 0,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{signal.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-semibold text-white text-sm">
                {signal.label}
              </span>
              <span className="text-xs font-medium flex-shrink-0">
                {STATUS_LABELS[signal.status]}
              </span>
            </div>

            {/* Score bar */}
            <div className="bg-gray-800 rounded-full h-1.5 mb-2">
              <div
                className={`${barColor} h-1.5 rounded-full transition-all duration-1000`}
                style={{ width: `${signal.score}%` }}
              />
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              {signal.reason}
            </p>

            {signal.detail && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {signal.detail}
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          <span className="text-lg font-bold text-white">{signal.score}</span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>
    </div>
  );
}
