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
        serif: ["'Playfair Display'", "'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
