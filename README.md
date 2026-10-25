# Loqqa website

Landing page for Loqqa, the workout logger for iOS and Android (app repo:
[`lifting-app`](https://github.com/timohuennebeck/lifting-app)). Planned home: useloqqa.com.

## Stack

- **Astro 7** with **TypeScript**: every page is static HTML, no JavaScript shipped unless a
  component asks for it.
- **Tailwind CSS v4** through `@tailwindcss/vite`. The colours in `src/styles/global.css` are the
  app's tokens (`lifting-app/src/global.css`), so `bg-bg`, `text-muted` and `bg-accent` match the app.
- **Inter** self-hosted via `@fontsource-variable/inter` (no request to Google Fonts).

## Getting started

Node 24 (`.nvmrc`; Astro needs at least 22.23.4).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check, then the static site in dist/
npm run preview
npm run format
```

## Structure

```
src/
  pages/           one file per route
  layouts/         the HTML shell (meta tags, global styles)
  styles/          global.css: Tailwind and the design tokens
  assets/          images Astro optimizes at build time; app-screens/ holds the app's screens
public/            files served as they are (favicon)
tools/
  app-screenshots/ captures the phone screens from the real app (see its README)
```

## Hosting

The build is static (`dist/`), so any static host works. Cloudflare Pages is the suggested choice
(free tier with unlimited bandwidth, preview deployments per branch, redirects and headers
files): connect the repo with build command `npm run build` and output directory `dist`.
