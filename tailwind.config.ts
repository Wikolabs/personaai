import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cardo'", "sans-serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
