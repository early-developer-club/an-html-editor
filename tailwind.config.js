/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Panel colors
        'panel-bg': '#f3f3f3',
        'panel-bg-dark': '#252526',
        'panel-header': '#e8e8e8',
        'panel-header-dark': '#2d2d30',
        'panel-border': '#d0d0d0',
        'panel-border-dark': '#3e3e42',

        // Canvas colors
        'canvas-bg': '#f5f5f5',
        'canvas-bg-dark': '#1e1e1e',

        // Input colors
        'input-bg': '#ffffff',
        'input-bg-dark': '#3c3c3c',
        'input-border': '#d0d0d0',
        'input-border-dark': '#555555',

        // Text colors
        'text-primary': '#333333',
        'text-primary-dark': '#cccccc',
        'text-muted': '#666666',
        'text-muted-dark': '#858585',

        // Item colors
        'item-bg': '#e8e8e8',
        'item-bg-dark': '#2d2d30',
        'item-hover': '#d4d4d4',
        'item-hover-dark': '#3e3e42',
        'item-selected': '#0078d4',
        'item-selected-dark': '#094771',

        // Button colors
        'button-bg': '#e8e8e8',
        'button-bg-dark': '#3c3c3c',
      },
    },
  },
}
