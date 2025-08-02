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
        'cyanblue': '#1860ac',
      },
      animation: {
        'marquee-slow': 'marquee 60s linear infinite',
        'marquee-medium': 'marquee 40s linear infinite',
        'marquee-fast': 'marquee 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}