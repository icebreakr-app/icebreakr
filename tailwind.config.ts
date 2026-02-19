import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#061024",
        panel: "#0a1a36",
        cyan: "#34d3ff",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(52, 211, 255, 0.25), 0 12px 40px rgba(8, 145, 178, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
