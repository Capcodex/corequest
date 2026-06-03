import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07111f",
        foreground: "#f3f7fb",
        panel: "#0f1b2d",
        panelAlt: "#13233a",
        accent: "#f59e0b",
        accentSoft: "#fbbf24",
        success: "#22c55e",
        danger: "#f87171",
        muted: "#8ca3bd",
        border: "rgba(148, 163, 184, 0.18)",
      },
      boxShadow: {
        glow: "0 24px 60px rgba(15, 23, 42, 0.35)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.14) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
