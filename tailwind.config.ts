import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        sans: ["Roboto", "sans-serif"],
      },
      colors: {
        google: {
          blue: "#4285F4",
          red: "#EA4335",
          yellow: "#FBBC05",
          green: "#34A853",
        },
      },
      spacing: {
        "84": "21rem",
        "88": "22rem",
      },
      boxShadow: {
        map: "0 2px 6px rgba(0,0,0,0.3)",
        card: "0 4px 20px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
