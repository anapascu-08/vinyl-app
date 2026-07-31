/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Accentul aplicației. Suprascrie violetul implicit din Tailwind.
        violet: {
          50: '#f6f3ff',
          100: '#ece5ff',
          200: '#dbcfff',
          300: '#c2adfa',
          400: '#a689f2',
          500: '#8b66e8',
          600: '#7048d8',
          700: '#5a37b0',
          800: '#452a86',
          900: '#2f1d5c',
        },
        // Text și contururi. ink-900 = titluri, 700 = corp, 500 = secundar, 300 = estompat.
        ink: {
          300: '#8b83a6',
          500: '#6f6791',
          700: '#413960',
          900: '#1d1436',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(29, 20, 54, 0.06), 0 8px 24px -12px rgba(112, 72, 216, 0.25)',
      },
    },
  },
  plugins: [],
}
