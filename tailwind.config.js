/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'baskervville': ['Baskervville', 'serif'],
        'golos': ['Golos Text', 'sans-serif'],
      },
      colors: {
        'villgro-green': '#46b753',
        'villgro-dark': '#231f20',
        'villgro-gray': '#a8a8a8',
        'villgro-orange': '#ec784c',
      },
    },
  },
  plugins: [],
}
