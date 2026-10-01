import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A221E",
        cream: {
          50: "#FCFBF8",
          100: "#F9F7F2",
          200: "#F3EFE6",
          300: "#E9E3D5",
          400: "#DCD4C3",
        },
        sage: {
          50: "#F3F7F3",
          100: "#E4EDE4",
          200: "#D0DFD0",
          300: "#ADC7AD",
          400: "#80A880",
          500: "#5D8A5D",
          600: "#446C44",
        },
        olive: {
          50: "#F2F6F3",
          100: "#DFECE1",
          200: "#BFD8C4",
          300: "#95BFA0",
          600: "#2F5838",
          700: "#27482E",
          800: "#213C27",
          900: "#1A301F",
          950: "#132317",
        },
      },
      fontFamily: {
        display: ["'Cinzel'", "'Cormorant Garamond'", "'Taviraj'", "serif"],
        serif: ["'Playfair Display'", "'Cormorant Garamond'", "'Taviraj'", "serif"],
        sans: ["'Plus Jakarta Sans'", "'Anuphan'", "system-ui", "sans-serif"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "radar-sweep": "radarSweep 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        radarSweep: {
          "0%": { transform: "translateY(0%)", opacity: "0" },
          "50%": { opacity: "0.8" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
