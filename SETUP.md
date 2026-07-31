# HexaFlow Site — Setup & Hosting

## Quick Start

```bash
cd hexaflow-site
npm install
npm run dev
```

Site runs at **http://localhost:4321**

---

## Hosting with Ngrok

1. Install Ngrok: https://ngrok.com/download (or `winget install ngrok`)
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. In a second terminal, expose it:
   ```bash
   ngrok http 4321
   ```
4. Ngrok prints a public URL like `https://abc123.ngrok.io` — share that link.

---

## Production Build (static files)

```bash
npm run build           # outputs to dist/
npx serve dist          # serves on port 3000
ngrok http 3000         # expose publicly
```

---

## Adding Your Google Slides Embed

In `src/pages/index.astro`, find the `<iframe>` near the bottom and replace the `src`:

```html
src="https://docs.google.com/presentation/d/e/YOUR_ID/embed?start=false&loop=false"
```

Get the embed URL from your Google Slides:
**File → Share → Publish to web → Embed**

---

## Adding Photos

- **CAD Drawings**: `src/pages/cad-drawings.astro` — add `<img>` tags or update the placeholder grid
- **Project Photos**: `src/pages/full-project-photos.astro` — same approach
- Place image files in `public/images/` and reference them as `/images/photo.jpg`

---

## Tech Stack

| Layer      | Tool                           |
|------------|-------------------------------|
| Framework  | Astro 4 (static output)       |
| Styling    | Tailwind CSS 3                |
| Fonts      | Inter + Space Grotesk (Google)|
| Hosting    | Any static server + Ngrok     |

---

## Pages

| Route                    | File                                    |
|--------------------------|-----------------------------------------|
| `/`                      | `src/pages/index.astro`                 |
| `/geometry`              | `src/pages/geometry.astro`              |
| `/drop-testing`          | `src/pages/drop-testing.astro`          |
| `/ai-control`            | `src/pages/ai-control.astro`            |
| `/user-interface`        | `src/pages/user-interface.astro`        |
| `/aeroponics`            | `src/pages/aeroponics.astro`            |
| `/secondary-substrates`  | `src/pages/secondary-substrates.astro`  |
| `/modular-enclosure`     | `src/pages/modular-enclosure.astro`     |
| `/cad-drawings`          | `src/pages/cad-drawings.astro`          |
| `/full-project-photos`   | `src/pages/full-project-photos.astro`   |
| `/bom`                   | `src/pages/bom.astro`                   |
| `/prototyping`           | `src/pages/prototyping.astro`           |
| `/sources`               | `src/pages/sources.astro`               |
