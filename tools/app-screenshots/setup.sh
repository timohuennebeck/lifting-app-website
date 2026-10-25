#!/usr/bin/env bash
# Prepares a web build of the app for screenshots in .work/app: a git worktree of lifting-app
# with the web dependencies, the preview shims and iPhone safe-area insets.
# Usage: ./setup.sh [path to lifting-app] (default: a lifting-app checkout next to this repo)
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
APP_REPO="$(cd "${1:-$HERE/../../../lifting-app}" && pwd)"
APP="$HERE/.work/app"
mkdir -p "$HERE/.work/mock"

if [ ! -d "$APP" ]; then
  git -C "$APP_REPO" worktree add --detach "$APP" HEAD
fi
cd "$APP"
npm ci --no-audit --no-fund

# Web dependencies in the versions this Expo SDK expects; nothing is saved to package.json.
version() { node -p "require('expo/bundledNativeModules.json')['$1']"; }
npm install --no-save --no-audit --no-fund \
  "react-dom@$(version react-dom)" \
  "react-native-web@$(version react-native-web)" \
  "@expo/metro-runtime@$(version @expo/metro-runtime)" \
  @powersync/web@2.5.0

mkdir -p web-shims
cp "$HERE"/shims/powersync.ts "$HERE"/shims/file-system.ts "$HERE"/shims/seed.ts web-shims/
[ -f metro.config.app.js ] || cp metro.config.js metro.config.app.js
cp "$HERE/shims/metro.config.js" metro.config.js

# The browser reports no safe area; use an iPhone 17 Pro's (62 pt top, 34 pt bottom).
for file in node_modules/react-native-safe-area-context/{src/NativeSafeAreaProvider.web.tsx,lib/module/NativeSafeAreaProvider.web.js,lib/commonjs/NativeSafeAreaProvider.web.js}; do
  sed -i.bak "s/style.paddingTop = getInset('top');/style.paddingTop = '62px';/; s/style.paddingBottom = getInset('bottom');/style.paddingBottom = '34px';/" "$file"
done

# Supabase is mocked by the screenshot script; the app only needs these to be set.
cat > .env <<'ENV'
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_preview
EXPO_PUBLIC_POWERSYNC_URL=http://127.0.0.1:8080
ENV

echo "Ready. Next: ./catalog.sh, then (cd .work/app && npx expo start --web --port 8081)"
