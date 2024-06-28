/** @type {import('tailwindcss').Config} */
// const colors = require('tailwindcss/colors')

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: ['lg:grid-cols-4', 'lg:grid-cols-6'],
  theme: {
    extend: {
      colors: {
        // ...colors,
        blue: {
          100: '#e7f5ff',
          200: '#c9e8ff',
          300: '#8dd5f8',
          400: '#5db8fe',
          500: '#37a6ed',
          600: '#0588cb',
          700: '#0f77b8',
          800: '#056aa6',
          900: '#005f9c',
          1000: '#005a99',
        },
        gray: {
          100: '#f8f9fa',
          200: '#f1f3f5',
          300: '#e9ecef',
          400: '#dee2e6',
          500: '#ced4da',
          600: '#adb5bd',
          700: '#868e96',
          800: '#495057',
          900: '#343a40',
          1000: '#212529',
        },
        indigo: {
          100: '#edf2ff',
          200: '#dbe4ff',
          300: '#bac8ff',
          400: '#91a7ff',
          500: '#748ffc',
          600: '#5c7cfa',
          700: '#4c6ef5',
          800: '#4263eb',
          900: '#3b5bdb',
          1000: '#364fc7',
        },
        violet: {
          100: '#f3f0ff',
          200: '#e5dbff',
          300: '#d0bfff',
          400: '#b197fc',
          500: '#9775fa',
          600: '#845ef7',
          700: '#7950f2',
          800: '#7048e8',
          900: '#6741d9',
          1000: '#5f3dc4',
        },
        fuchsia: {
          100: '#f8f0fc',
          200: '#f3d9fa',
          300: '#eebefa',
          400: '#e599f7',
          500: '#da77f2',
          600: '#cc5de8',
          700: '#be4bdb',
          800: '#ae3ec9',
          900: '#9c36b5',
          1000: '#862e9c',
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        h1: {
          fontSize: theme('fontSize.5xl'),
          fontWeight: theme('fontWeight.light'),
          lineHeight: theme('lineHeight.normal'),
        },
        h2: {
          fontSize: theme('fontSize.4xl'),
          fontWeight: theme('fontWeight.light'),
          lineHeight: theme('lineHeight.normal'),
        },
        h3: {
          fontSize: theme('fontSize.3xl'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('lineHeight.normal'),
        },
        h4: {
          fontSize: theme('fontSize.xl'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('lineHeight.normal'),
        },
        h5: {
          fontSize: theme('fontSize.base'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('lineHeight.normal'),
        },
        h6: {
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('lineHeight.normal'),
        },
      })
    }),
    // require('ooni-components/tailwind'),
  ],
}
