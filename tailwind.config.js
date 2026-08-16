/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark teal theme — base: #094140
        dark: {
          900: "#050e0e",   // deepest bg
          800: "#081919",   // sidebar bg
          750: "#0b2222",   // card bg
          700: "#0d2b2b",   // elevated card
          600: "#123535",   // border/hover
          500: "#184444",   // subtle divider
        },
        primary: {
          50:  "#e8f7f7",   // lightest teal tint
          100: "#d0f0ef",   // very light teal
          200: "#a0e0de",   // light teal
          300: "#50b8b5",   // medium teal
          400: "#1a8a86",   // teal
          500: "#0d5c58",   // rich teal
          600: "#094140",   // brand color ← main
          700: "#063230",   // darker teal
          800: "#042422",   // deep dark teal
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
