import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// HF_BASE controls the deploy target:
//   '' or '/'  -> root (Vercel/Netlify/custom domain)
//   '/hexaflow/' -> GitHub Pages project page
export default defineConfig(() => ({
  base: process.env.HF_BASE || '/',
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: true }
}))