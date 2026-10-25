// Opens the app's web preview signed in, with Supabase mocked from the dumped catalog
// (catalog.sh) and the progress-check photos taken from the app's own paywall images.
const fs = require('fs');
const path = require('path');

const WORK = path.join(__dirname, '.work');
const MOCK = path.join(WORK, 'mock');
const APP = path.join(WORK, 'app');

const USER_ID = '6f1c2a3e-5b7d-4e8f-9a0b-1c2d3e4f5a6b';
const user = {
  id: USER_ID,
  aud: 'authenticated',
  role: 'authenticated',
  email: 'alex@example.com',
  app_metadata: { provider: 'apple', providers: ['apple'] },
  user_metadata: { full_name: 'Alex' },
  created_at: '2026-08-20T08:00:00Z',
};
const session = {
  access_token: 'preview-access-token',
  refresh_token: 'preview-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: 4102444800,
  user,
};

const readMock = (table) => JSON.parse(fs.readFileSync(path.join(MOCK, `${table}.json`), 'utf8'));
const tables = {
  exercises: readMock('exercises'),
  equipment: readMock('equipment'),
  legal_documents: readMock('legal_documents'),
  profiles: [{ id: USER_ID, onboarded_at: '2026-08-20T08:20:00Z' }],
};

/** wa-sqlite's wasm, wherever npm put it. */
function wasmFile(name) {
  const candidates = [
    path.join(APP, 'node_modules/@powersync/web/node_modules/@journeyapps/wa-sqlite/dist', name),
    path.join(APP, 'node_modules/@journeyapps/wa-sqlite/dist', name),
  ];
  return candidates.find((file) => fs.existsSync(file));
}

/** Enough of PostgREST's filters for the app's reads: eq, in, lte, gt, order, limit, offset. */
function postgrest(table, params) {
  let rows = [...(tables[table] ?? [])];
  for (const [key, value] of params) {
    if (['select', 'order', 'limit', 'offset'].includes(key)) continue;
    const [op, ...rest] = value.split('.');
    const arg = rest.join('.');
    if (op === 'eq') rows = rows.filter((r) => String(r[key]) === arg);
    if (op === 'in') {
      const list = arg
        .replace(/^\(|\)$/g, '')
        .split(',')
        .map((s) => s.replace(/"/g, ''));
      rows = rows.filter((r) => list.includes(String(r[key])));
    }
    if (op === 'lte') rows = rows.filter((r) => new Date(r[key]) <= new Date(arg));
    if (op === 'gt') rows = rows.filter((r) => String(r[key]) > arg);
  }
  const order = params.get('order');
  if (order) {
    const [col, dir] = order.split('.');
    const sign = dir === 'desc' ? -1 : 1;
    rows.sort((a, b) => (a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0) * sign);
  }
  const offset = Number(params.get('offset') ?? 0);
  const limit = params.get('limit') ? Number(params.get('limit')) : rows.length;
  return rows.slice(offset, offset + limit);
}

const json = (route, body, status = 200) =>
  route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

/**
 * Signs the browser context in (Pro, onboarded) and mocks Supabase and PowerSync. `language` is
 * an app language (en, de, pt-PT, pt-BR, ko): the seed names the plan in it.
 */
async function prepare(context, { language = 'en' } = {}) {
  await context.addInitScript(
    ({ session, language }) => {
      window.__previewLanguage = language;
      if (sessionStorage.getItem('preview-init')) return;
      sessionStorage.setItem('preview-init', '1');
      localStorage.clear();
      // MMKV on the web keeps its values in localStorage as `<id>\<key>`.
      const set = (key, value) => localStorage.setItem(`loqqa\\${key}`, JSON.stringify(value));
      set('sb-127-auth-token', session);
      set('onboarding', { state: { completed: true, draft: { firstName: 'Alex' } }, version: 0 });
      set('subscription', {
        state: { isPro: true, plan: 'yearly', trialEndsAt: null, checked: true },
        version: 0,
      });
      set('purchases.mock.receipt', { isPro: true, plan: 'yearly', trialEndsAt: null });
    },
    { session, language },
  );
  await context.route('**/*.wasm', (route) => {
    const file = wasmFile(path.basename(new URL(route.request().url()).pathname));
    route.fulfill({ status: 200, contentType: 'application/wasm', body: fs.readFileSync(file) });
  });
  await context.route('http://127.0.0.1:55321/**', (route) => {
    const url = new URL(route.request().url());
    const [, api, , resource] = url.pathname.split('/');
    if (api === 'rest') {
      const rows = postgrest(resource, url.searchParams);
      const single = (route.request().headers()['accept'] ?? '').includes('pgrst.object');
      return json(route, single ? (rows[0] ?? null) : rows);
    }
    if (api === 'auth') return json(route, url.pathname.endsWith('/user') ? user : session);
    if (api === 'storage') {
      // /storage/v1/object/sign/<bucket>/<path>: POST signs, GET serves the photo.
      const objectPath = url.pathname.split('/object/sign/')[1] ?? '';
      if (route.request().method() === 'POST') {
        return json(route, { signedURL: `/object/sign/${objectPath}?token=preview` });
      }
      const photo = objectPath.includes('0000000000c1') ? 'before.jpg' : 'after.jpg';
      const file = path.join(APP, 'assets/images/paywall', photo);
      return route.fulfill({ status: 200, contentType: 'image/jpeg', body: fs.readFileSync(file) });
    }
    return json(route, {});
  });
  await context.route('http://127.0.0.1:8080/**', (route) => route.abort());
}

module.exports = { prepare };
