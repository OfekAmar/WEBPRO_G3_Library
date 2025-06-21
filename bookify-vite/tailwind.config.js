/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
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
      keyframes: {
        "spinslow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "rotate-circle": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        "spinslow": "spinslow 8s linear infinite",
        "rotate-circle": "rotate-circle 12s linear infinite",
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
    plugins: [],
  }
}

