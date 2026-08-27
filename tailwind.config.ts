import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10162B",
        paper: "#F6F7F5",
        signal: "#2B4EFF",
        signalDark: "#1E3AC7",
        pen: "#D64545",
        penDark: "#B93636",
        correct: "#1B8A5A",
        marked: "#E8A33D",
        line: "#E3E6EC",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};

export default config;
