/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1120', // Custom Deep Blue for Sidebar
        },
        emerald: {
          400: '#34d399',
          500: '#10b981', // Custom Green for Accents
        }
      }
    },
  },
  plugins: [],
}