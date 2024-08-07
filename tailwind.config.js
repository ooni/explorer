/** @type {import('tailwindcss').Config} */
import { theme } from 'ooni-components'

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/ooni-components/dist/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: ['lg:grid-cols-4', 'lg:grid-cols-6'],
  theme,
}
