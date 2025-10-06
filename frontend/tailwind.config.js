/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        success: '#4CAF50',
        accent: '#FFC107',
      },
    },
  },
  plugins: [],
};
