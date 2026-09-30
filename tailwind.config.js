/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f4',
          100: '#fbe8eb',
          200: '#f8d2d9',
          300: '#f2acb9',
          400: '#ea7d92',
          500: '#de516e',
          600: '#c83253',
          700: '#a72340',
          800: '#8c2038',
          900: '#771f34',
          950: '#430c19',
        },
        gold: {
          50: '#fbf9ed',
          100: '#f6f1d1',
          200: '#eee2a6',
          300: '#e3cd72',
          400: '#d7b744',
          500: '#c39d2c',
          600: '#a87f22',
          700: '#865f1e',
          800: '#704c1f',
          900: '#5f401f',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'float': '0 12px 32px rgba(167, 35, 64, 0.15)',
      }
    },
  },
  plugins: [],
}
