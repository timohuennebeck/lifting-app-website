// The app's Metro config (copied to metro.config.app.js by setup.sh) with web-only stand-ins for
// the native modules the screenshot preview can't run.
const path = require('path');

const config = require('./metro.config.app.js');

const WEB_SHIMS = {
  '@powersync/react-native': path.resolve(__dirname, 'web-shims/powersync.ts'),
  'expo-file-system': path.resolve(__dirname, 'web-shims/file-system.ts'),
};

const upstream = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && WEB_SHIMS[moduleName]) {
    return { type: 'sourceFile', filePath: WEB_SHIMS[moduleName] };
  }
  return (upstream ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
