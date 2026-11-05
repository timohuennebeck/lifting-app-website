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
npm run legal:sync   # copy the legal texts from ../lifting-app/docs/legal
```

## Structure

```
src/
  pages/[...lang]/ the home page, terms, privacy and imprint, once per language
  layouts/         Layout (head, header, footer) and LegalPage
  components/      header, language switcher, footer, phone frame, App Store button
  i18n/            the languages and every text of the site
  content/legal/   terms and privacy policy per language (synced from the app repo)
  lib/             the rehype plugin that lays out the legal texts' sections
  styles/          global.css: Tailwind, the design's colours, the phone frame, legal text
  assets/          app-screens/<language>/ (the app's screens), body-check/ (photos)
  config.ts        App Store link and the operator's details for the imprint
public/            files served as they are (favicon)
scripts/           sync-legal.mjs
tools/
  app-screenshots/ captures the phone screens from the real app (see its README)
```

## Languages

The app's five: German at `/` (the design's language), English at `/en`, Portuguese at `/pt`,
Brazilian Portuguese at `/pt-br` and Korean at `/ko`, each with `/terms`, `/privacy` and
`/imprint`. All copy lives in `src/i18n/strings.ts`; the phone screens are the app in the same
language. The language menu links each page to itself in the other languages.

## Legal pages

The terms and privacy policy are the app's own texts (`lifting-app/docs/legal`, the versions the
app shows): `npm run legal:sync` copies them into `src/content/legal/` after they change there.
German is binding. The imprint takes the
operator's details from `src/config.ts`, as the terms state them.

`APP_STORE_URL` in `src/config.ts` is `#` until the app is in the App Store.

## Hosting

The build is static (`dist/`, one `.html` file per page, served without the extension), so any
static host works. It runs on Cloudflare Workers, connected to this repo through Workers Builds.
`wrangler.jsonc` gives Wrangler the Worker's name, the build command and the output directory.
Branch builds need it: `wrangler versions upload` doesn't detect any of that by itself.
