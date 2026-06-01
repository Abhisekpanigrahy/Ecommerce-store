/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#fdfbf7', // Cream background
        'accent': '#c98d83',  // Soft terracotta
        'earth-gray': '#4a4543', // Warm dark gray
        'soft-olive': '#8b8c7a', // Muted olive
      },
      fontFamily: {
        'serif': ['Prata', 'serif'],
        'sans': ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}