/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: '#1e1e1e',
          panel: '#252526',
          panelHover: '#2d2d30',
          border: '#3e3e42',
          text: '#cccccc',
          textMuted: '#858585',
          accent: '#0066cc',
          accentHover: '#094771',
          danger: '#c42b1c',
          success: '#107c10',
        },
      },
    },
  },
  plugins: [],
}
