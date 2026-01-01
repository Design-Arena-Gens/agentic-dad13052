import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecf8ff",
          100: "#d7edff",
          200: "#abd8ff",
          300: "#7cc2ff",
          400: "#4dafed",
          500: "#1e96d4",
          600: "#0b74aa",
          700: "#055c86",
          800: "#04476a",
          900: "#033756"
        }
      }
    }
  },
  plugins: []
};

export default config;
