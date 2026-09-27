import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Base path. '/' works for local preview, ngrok, a custom domain, or a root
// <user>.github.io repo. For a project page at <user>.github.io/hexaflow/ you also
// need the absolute-path refactor described in README "Deploy" — set HF_BASE=/hexaflow.
const base = process.env.HF_BASE || '/';

export default defineConfig({
  site: 'https://lucasbianco.github.io',
  base,
  integrations: [tailwind()],
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
});