export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        safe: "#22c55e",
        caution: "#f59e0b",
        risky: "#ef4444",
        unknown: "#6b7280",
        brand: "#6366f1",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
