import type { Config } from "tailwindcss";

// Design tokens — a calm clinical palette (not the generic cream/terracotta
// or SaaS-card defaults): deep teal for trust/medical seriousness, a soft
// warm sand background so the app doesn't feel cold, and a single amber
// accent reserved ONLY for "needs attention" states (never decorative).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B211E",
        canvas: "#F7F5F0",
        surface: "#FFFFFF",
        teal: {
          50: "#EEF5F2",
          100: "#D7E8E1",
          400: "#3C8272",
          600: "#25604F",
          900: "#123B30",
        },
        sand: {
          100: "#EFEAE0",
          300: "#DCD3C0",
        },
        attention: {
          50: "#FBF0E4",
          400: "#C97A2E",
          600: "#9C5A1A",
        },
        caution: {
          50: "#FBEAEA",
          500: "#B5423A",
        },
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "'IBM Plex Sans Thai'", "system-ui", "sans-serif"],
        display: ["'Fraunces'", "serif"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
