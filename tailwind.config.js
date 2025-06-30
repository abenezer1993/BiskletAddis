/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2ECC71',
        accent: '#3498DB',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        'text-primary': '#333333',
        'text-secondary': '#666666',
        'bg-light': '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};