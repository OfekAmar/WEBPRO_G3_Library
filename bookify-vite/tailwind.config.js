/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'], // or any font you prefer
      },
      colors: {
        background: "rgb(var(--background))",
        card: "rgb(var(--card))",
        border: "rgb(var(--border))",
        cta: "rgb(var(--cta))",
        "cta-text": "rgb(var(--cta-text))",
        "copy-primary": "rgb(var(--copy-primary))",
        "copy-secondary": "rgb(var(--copy-secondary))",
      },
    },
  },
  plugins: [],
}