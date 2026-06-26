/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          slate: {
            light: '#f8fafc',
            accent: '#3b82f6',
          },
          dashboard: {
            light: '#faf5ff',
            accent: '#8b5cf6',
          },
          transactions: {
            light: '#f0fdf4',
            accent: '#10b981',
          },
          settings: {
            light: '#fffbeb',
            accent: '#f59e0b',
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
