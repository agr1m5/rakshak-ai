/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ink scale — the app's dark "operations room" surfaces
        ink: {
          950: "#0A0F1A",
          900: "#111827",
          800: "#172033",
          700: "#24314A",
          600: "#374863",
          400: "#8B95A7",
          200: "#C7CEDB",
          50: "#E7ECF3",
        },
        // Signature accent — the "sentinel" scanning teal
        sentinel: {
          300: "#8FF0DF",
          400: "#38E1C6",
          500: "#1FB89F",
          600: "#158C79",
          900: "#0C3A33",
        },
        // Severity is a deliberately separate palette from brand color
        severity: {
          low: "#22C55E",
          medium: "#F59E0B",
          high: "#F97316",
          critical: "#EF4444",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56, 225, 198, 0.15), 0 0 24px rgba(56, 225, 198, 0.08)",
      },
      keyframes: {
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        sweep: "sweep 6s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.2, 0.6, 0.4, 1) infinite",
      },
    },
  },
  plugins: [],
}
