/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pitch Black dark theme — base: #000000
        dark: {
          950: "#000000",   // absolute pitch black
          900: "#000000",   // main app bg (pitch black)
          800: "#09090b",   // sidebar & header bg
          750: "#121215",   // main card bg
          700: "#18181b",   // elevated card / input bg
          600: "#27272a",   // borders / hover state
          500: "#3f3f46",   // subtle divider
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
