/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'blue': '#232946',
      'light': '#fffffe',
      'light-lilac': '#f5f6fc',
      'lilac': '#d4d8f0',
      'dark-lilac': '#b8c1ec',
      'pink': '#eebbc3',
      'light-pink': '#ffe3e7',
      'dark-blue': '#121629'
    },
    extend: {
      fontFamily: {
        sans: ['Comfortaa', 'sans-serif'],
        Montserrat: ['Comfortaa', 'sans-serif'],
      },
    }
  },
  plugins: [],
}