import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202A",
        mint: "#8DD6C3",
        coral: "#F27C66",
        gold: "#E8B44F",
        paper: "#F7F4EF"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
