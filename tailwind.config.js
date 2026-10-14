/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sarabun: ['Sarabun', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        soundwave: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '18px' },
        }
      },
      animation: {
        soundwave: 'soundwave 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
