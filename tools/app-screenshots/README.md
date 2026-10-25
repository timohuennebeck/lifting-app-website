# App screenshots

The phone screens on the website are screenshots of the real app (`lifting-app`), taken from its
web build in Chromium at iPhone 17 Pro size (402×874 pt at @3x, 1206×2622 px). Nothing is
mocked up: the screens are the app's own components with seeded data. Output goes to
`src/assets/app-screens/`.

## What the preview changes

The app has no web build, so `setup.sh` prepares one in `.work/app`, a git worktree of
`lifting-app` that the app repo never sees:

- **Web dependencies** (`react-dom`, `react-native-web`, `@expo/metro-runtime`, `@powersync/web`),
  installed without touching `package.json`.
- **Shims** (`shims/`, wired up for web only in `shims/metro.config.js`):
  - `powersync.ts`: PowerSync's web SDK on an in-memory SQLite instead of op-sqlite. It never
    connects, reports a finished sync and seeds the data in `seed.ts`.
  - `file-system.ts`: no local files, so progress-check photos load from (mocked) storage.
  - `seed.ts`: the account "Alex": an Upper / Lower 4× plan in its ninth week, every workout
    logged with steady progress, ten weeks of body weight and two progress checks.
- **Safe area**: the browser reports none, so the iPhone's insets (62 pt top, 34 pt bottom) are
  patched into `react-native-safe-area-context`.

`harness.js` signs the browser in (Pro, onboarded), answers Supabase from the dumped catalog
and serves the app's own paywall photos as the progress-check photos. `chrome.js` draws what
iOS draws around the app: the status bar, the home indicator and the native tab bar, as
`NativeTabs` configures it (iOS 26 style, `#DFFF1F` tint, "+" detached on the right).

## Taking them

Node 22 for the app, and `psql`.

```bash
cd tools/app-screenshots
npm install && npx playwright install chromium
./setup.sh ../../../lifting-app      # path to the app checkout

# The catalog (exercises, equipment, legal texts) from a database with the app's migrations:
# the local Supabase (`npm run supabase:start` in the app) is the default.
./catalog.sh

(cd .work/app && npx expo start --web --port 8081)   # keep it running
node shoot.js                        # all screens in spec.json
node shoot.js spec.json ../../src/assets/app-screens training,level   # some of them
```

Without Docker, plain Postgres works too: create a database, run `supabase-stubs.sql` (the
roles, `auth` and `storage` bits Supabase provides), then every file in
`lifting-app/supabase/migrations/` in order, and pass its URL to `./catalog.sh`.

## The screens

`spec.json` lists them: the four tabs (Training, Level, Body, Profile), the Level tab scrolled to
the muscles, a running workout, a workout summary, an exercise and its history, the body weight
history, a progress check result and its comparison, the ranks, a routine, the plan import and
the paywall. Each entry is a route plus optional taps; see the top of `shoot.js`.

The clock in the status bar always reads 9:41; dates in the app follow the day it runs.
