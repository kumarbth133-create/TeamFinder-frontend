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
          50:  "#fff1f2",   // soft crimson background
          100: "#ffe2e5",   // subtle crimson tint
          200: "#ffc9ce",   // soft crimson border
          300: "#fa96a0",   // light crimson
          400: "#f1596b",   // medium crimson
          500: "#dc142a",   // vibrant crimson
          600: "#ca0019",   // main brand color (#ca0019)
          700: "#a60014",   // rich dark crimson
          800: "#850010",   // deep crimson
          900: "#63000c",   // dark midnight red
          950: "#3d0007",   // deep shadow red
        },
      },
      fontFamily: {
        sans: [
          "Season Mix",
          "Season",
          "Product Sans",
          "Google Sans",
          "Plus Jakarta Sans",
          "Roboto",
          "Outfit",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
