// Prefix root-absolute URLs with the configured base path so one build serves
// root (Vercel/Netlify/custom domain) and GitHub Pages project page (/hexaflow/).

export const BASE = import.meta.env.BASE_URL || '/'

export function withBase(p) {
  if (!p) return BASE
  if (/^(https?:)?\/\//.test(p) || p.startsWith('data:') || p.startsWith('blob:')) return p
  const root = BASE.endsWith('/') ? BASE : BASE + '/'
  return root + p.replace(/^\/+/, '')
}

// react-router basename: '' for root deploys, '/hexaflow' for the project page.
export const ROUTE_BASE = (() => {
  const b = import.meta.env.BASE_URL || '/'
  return b === '/' ? '' : b.replace(/\/$/, '')
})()