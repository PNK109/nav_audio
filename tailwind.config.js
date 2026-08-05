/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        float: '0 18px 40px -20px rgba(15, 23, 42, 0.55)',
      },
    },
  },
  plugins: [],
}
