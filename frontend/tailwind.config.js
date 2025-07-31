// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#0e0515',
        'background': '#f8f2fd',
        'primary': '#4e1a7f',
        'secondary': '#e26f9b',
        'accent': '#c3282a',
      },
    },
  },
  plugins: [],
}