// Screenshots of the app's web preview at iPhone 17 Pro size (402×874 pt, @3x), in one of the
// app's languages. The Expo web server must run on :8081.
// Usage: node shoot.js [--lang de] [--only training,workout] [--spec spec.json] [--out dir]
// (default out: src/assets/app-screens/<lang>/)
// Spec entries: { name, route, tab?, sql?, click?, tap?, after?, scroll?, wait? }:
// - `:id` in `route` becomes the first column of `sql`'s first row (seeded database)
// - `click` taps elements by their exact text, `tap` taps [x, y, wait ms?] points (pt)
// - `after` runs SQL once the screen is open, `scroll` scrolls its main list (pt)
// - `tab` draws the tab bar with that tab selected; without it the home indicator shows
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { prepare } = require('./harness');
const { addChrome } = require('./chrome');

const HIDE = `#error-toast { display: none !important; }
[class*="navigationMenuRoot"] { display: none !important; }
* { scrollbar-width: none !important; } ::-webkit-scrollbar { display: none !important; }`;

/** Browser locale per app language; the app reads its language from it. */
const BROWSER_LOCALES = {
  en: 'en-US',
  de: 'de-DE',
  'pt-PT': 'pt-PT',
  'pt-BR': 'pt-BR',
  ko: 'ko-KR',
};

// iOS draws Hangul in its system font; the preview's Inter has none, so Noto Sans KR stands in,
// as later faces of the app's Inter families that only cover Hangul.
const HANGUL = 'U+1100-11FF, U+3130-318F, U+A960-A97F, U+AC00-D7AF, U+D7B0-D7FF';
const KR_FILES = path.join(__dirname, 'node_modules/@fontsource/noto-sans-kr/files');
const KR_FAMILIES = {
  Inter_400Regular: 400,
  Inter_500Medium: 500,
  Inter_600SemiBold: 600,
  Inter_700Bold: 700,
};
const krFace = (family, weight, descriptors = '') =>
  `@font-face { font-family: '${family}'; ${descriptors} src: url(/__preview-fonts/noto-sans-kr-korean-${weight}-normal.woff2) format('woff2'); unicode-range: ${HANGUL}; }`;
const KOREAN_FONTS = [
  ...Object.entries(KR_FAMILIES).map(([family, weight]) => krFace(family, weight)),
  krFace('Preview KR', 500, 'font-weight: 500;'),
  krFace('Preview KR', 600, 'font-weight: 600;'),
].join('\n');

function args() {
  const out = { lang: 'en' };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 2) out[argv[i].replace(/^--/, '')] = argv[i + 1];
  return out;
}

const runSql = (page, sqls) =>
  page.evaluate(async (list) => {
    for (const sql of list) await globalThis.__previewDb.execute(sql);
  }, sqls);

(async () => {
  const { lang, only: onlyArg, spec: specArg, out } = args();
  const specFile = specArg ?? path.join(__dirname, 'spec.json');
  const outDir = out ?? path.join(__dirname, '../../src/assets/app-screens', lang);
  const only = onlyArg?.split(',');
  const appLocales = path.join(__dirname, '.work/app/src/shared/i18n/locales');
  const labels = JSON.parse(fs.readFileSync(path.join(appLocales, lang, 'common.json'))).tabs;
  const spec = JSON.parse(fs.readFileSync(specFile, 'utf8')).filter(
    (s) => !only || only.includes(s.name),
  );
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 3,
    locale: BROWSER_LOCALES[lang],
  });
  await prepare(context, { language: lang });
  await context.route('**/__preview-fonts/*', (route) =>
    route.fulfill({
      contentType: 'font/woff2',
      path: path.join(KR_FILES, path.basename(new URL(route.request().url()).pathname)),
    }),
  );
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 300)));
  await page.goto('http://localhost:8081/', { waitUntil: 'domcontentloaded', timeout: 300000 });
  await page.waitForFunction(() => globalThis.__previewSeeded === true, null, { timeout: 120000 });
  await page.waitForTimeout(3000);
  await page.addStyleTag({ content: HIDE });
  if (lang === 'ko') await page.addStyleTag({ content: KOREAN_FONTS });

  for (const shot of spec) {
    let route = shot.route;
    if (shot.sql) {
      const id = await page.evaluate(async (sql) => {
        const rows = await globalThis.__previewDb.getAll(sql);
        return rows[0] ? Object.values(rows[0])[0] : null;
      }, shot.sql);
      route = route.replace(':id', id);
    }
    // In-page navigation keeps the seeded in-memory database.
    await page.evaluate((r) => globalThis.__previewRouter.push(r), route);
    await page.waitForTimeout(shot.wait ?? 3000);
    for (const text of shot.click ?? []) {
      await page.getByText(text, { exact: true }).last().click({ force: true, timeout: 8000 });
      await page.waitForTimeout(1500);
    }
    for (const [x, y, waitMs = 900] of shot.tap ?? []) {
      await page.mouse.click(x, y);
      await page.waitForTimeout(waitMs);
    }
    if (shot.after) {
      await runSql(page, shot.after);
      await page.waitForTimeout(1200);
    }
    if (shot.scroll) {
      await page.evaluate((y) => {
        // The tallest vertical scroller on screen (pager tabs keep theirs off to the side).
        const scrollers = [...document.querySelectorAll('div')].filter((d) => {
          const s = getComputedStyle(d);
          const scrolls = s.overflowY === 'auto' || s.overflowY === 'scroll';
          const onScreen = d.getBoundingClientRect().x >= 0;
          return (
            scrolls && onScreen && d.scrollHeight > d.clientHeight + 10 && d.clientHeight > 300
          );
        });
        const target = scrollers.sort((a, b) => b.clientHeight - a.clientHeight)[0];
        if (target) target.scrollTop = y;
      }, shot.scroll);
      await page.waitForTimeout(800);
    }
    await addChrome(page, { tab: shot.tab ?? null, home: !shot.tab, labels });
    await page.screenshot({ path: path.join(outDir, `${shot.name}.png`) });
    await page.evaluate(() => document.getElementById('preview-chrome')?.remove());
    console.log('saved', lang, shot.name);
  }
  await browser.close();
})();
