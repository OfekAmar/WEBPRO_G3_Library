module.exports = {
  content: ["./*.{html,js,ts}"],
  darkMode: 'class',
  theme: {
    extends: {},
    screens: {
      'sm': '640px',
      //=> @media(min-width: 640px){...}
      'md': '768px',
      //=> @media(min-width: 768px){...}
      'lg': '1024px',
      //=> @media(min-width: 1024px){...}
      'xl': '1280px',
      //=> @media(min-width: 1280px){...}
      '2xl': '1536px'
      //=> @media(min-width: 1536px){...}
    },
  },
  plugins: [require("prettier-plugin-tailwindcss"),
  require("@tailwindcss/typography"),
  require("@tailwindcss/forms"),
  require("@tailwindcss/aspect-ratio")
  ],
};
