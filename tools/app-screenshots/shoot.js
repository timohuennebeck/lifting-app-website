// Screenshots of the app's web preview at iPhone 17 Pro size (402×874 pt, @3x).
// Usage: node shoot.js [spec.json] [out dir] [names,…]; the Expo web server must run on :8081.
// Spec entries: { name, route, tab?, sql?, click?, tap?, after?, scroll?, wait? }:
// - `:id` in `route` becomes the first column of `sql`'s first row (seeded database)
// - `click` taps elements by their exact text, `tap` taps [x, y] points (pt)
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

const runSql = (page, sqls) =>
  page.evaluate(async (list) => {
    for (const sql of list) await globalThis.__previewDb.execute(sql);
  }, sqls);

(async () => {
  const specFile = process.argv[2] ?? path.join(__dirname, 'spec.json');
  const outDir = process.argv[3] ?? path.join(__dirname, '../../src/assets/app-screens');
  const only = process.argv[4]?.split(',');
  const spec = JSON.parse(fs.readFileSync(specFile, 'utf8')).filter(
    (s) => !only || only.includes(s.name),
  );
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 3,
    locale: 'en-US',
  });
  await prepare(context);
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 300)));
  await page.goto('http://localhost:8081/', { waitUntil: 'domcontentloaded', timeout: 300000 });
  await page.waitForFunction(() => globalThis.__previewSeeded === true, null, { timeout: 120000 });
  await page.waitForTimeout(3000);
  await page.addStyleTag({ content: HIDE });

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
    for (const [x, y] of shot.tap ?? []) {
      await page.mouse.click(x, y);
      await page.waitForTimeout(900);
    }
    if (shot.after) {
      await runSql(page, shot.after);
      await page.waitForTimeout(1200);
    }
    if (shot.scroll) {
      await page.evaluate((y) => {
        const scrollers = [...document.querySelectorAll('div')].filter((d) => {
          const s = getComputedStyle(d);
          const scrolls = s.overflowY === 'auto' || s.overflowY === 'scroll';
          return scrolls && d.scrollHeight > d.clientHeight + 10 && d.clientHeight > 300;
        });
        const target = scrollers.sort((a, b) => b.clientHeight - a.clientHeight)[0];
        if (target) target.scrollTop = y;
      }, shot.scroll);
      await page.waitForTimeout(800);
    }
    await addChrome(page, { tab: shot.tab ?? null, home: !shot.tab });
    await page.screenshot({ path: path.join(outDir, `${shot.name}.png`) });
    await page.evaluate(() => document.getElementById('preview-chrome')?.remove());
    console.log('saved', shot.name);
  }
  await browser.close();
})();
