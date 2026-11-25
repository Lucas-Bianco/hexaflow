/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'hex-bg':      '#060e1c',
        'hex-surface': '#091829',
        'hex-card':    '#0d1e35',
        'hex-gold':    '#d4a017',
        'hex-blue':    '#93c5fd',
        'hex-muted':   '#7090b8',
        'hex-text':    '#f0f4ff',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
};
