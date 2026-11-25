/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        hex: {
          bg: '#060e1c',
          panel: '#0b1730',
          gold: '#d4a017',
          muted: '#94a3b8',
          muted2: '#64748b',
          line: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}