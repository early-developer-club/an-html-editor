/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: {
          DEFAULT: '#f3f3f3',
          dark: '#252526',
        },
        panelHeader: {
          DEFAULT: '#e8e8e8',
          dark: '#2d2d30',
        },
        panelBorder: {
          DEFAULT: '#d0d0d0',
          dark: '#3e3e42',
        },
        canvasBg: {
          DEFAULT: '#f5f5f5',
          dark: '#1e1e1e',
        },
        input: {
          DEFAULT: '#ffffff',
          dark: '#3c3c3c',
        },
        inputBorder: {
          DEFAULT: '#d0d0d0',
          dark: '#555555',
        },
        textPrimary: {
          DEFAULT: '#333333',
          dark: '#cccccc',
        },
        textMuted: {
          DEFAULT: '#666666',
          dark: '#858585',
        },
        itemBg: {
          DEFAULT: '#e8e8e8',
          dark: '#2d2d30',
        },
        itemHover: {
          DEFAULT: '#d4d4d4',
          dark: '#3e3e42',
        },
        itemSelected: {
          DEFAULT: '#0078d4',
          dark: '#094771',
        },
        buttonBg: {
          DEFAULT: '#e8e8e8',
          dark: '#3c3c3c',
        },
      },
    },
  },
}
