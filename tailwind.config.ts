import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F5F1",
        ink: "#1C2333",
        indigo: "#33415C",
        gold: "#C89B3C",
        sage: "#6B8F71",
      },
    },
  },
  plugins: [],
};
export default config;
