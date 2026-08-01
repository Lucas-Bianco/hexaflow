// Base-path helper.
//
// The site can be served from the domain root (`base: '/'` — custom domain, ngrok,
// local preview, a root <user>.github.io repo) or from a subpath (`base: '/hexaflow'`
// — a GitHub Pages *project* page at lucas-bianco.github.io/hexaflow/).
//
// Astro only rewrites the paths it can see statically. Every URL this site builds at
// runtime — nav links, `parts.js` image / CAD / model paths, the glTF the 3D viewer
// fetches — is a plain string, so Astro leaves it alone and it 404s under a subpath.
// Route each of those through `withBase()` at the point of use.
//
// Deliberately applied at consumption, not baked into `parts.js`: the literals there
// stay clean, portable data, and nothing downstream has to know about the base path.

const BASE = import.meta.env.BASE_URL; // '/' or '/hexaflow/'
const PREFIX = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE; // '' or '/hexaflow'

/** Prefix a root-absolute site path with the configured base. */
export function withBase(path) {
  if (!path) return path;
  // Leave anything that isn't a root-absolute site path exactly as it is.
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(path)) return path; // http(s):// and //cdn
  if (/^(mailto:|tel:|data:|#)/i.test(path)) return path;
  if (!path.startsWith('/')) return path; // already relative
  return PREFIX + path;
}

/** `withBase()` for paths that may contain spaces or `+` — the CAD filenames do. */
export function withBaseURI(path) {
  const based = withBase(path);
  return based ? encodeURI(based) : based;
}

/** Strip the base off a runtime pathname so it can be compared to a bare route. */
export function stripBase(pathname) {
  if (PREFIX && pathname.startsWith(PREFIX)) return pathname.slice(PREFIX.length) || '/';
  return pathname;
}
