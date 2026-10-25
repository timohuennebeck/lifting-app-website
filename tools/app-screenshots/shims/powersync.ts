// Web-only stand-in for @powersync/react-native (screenshot preview): PowerSync's web SDK on an
// in-memory wa-sqlite, never connecting; it reports a finished sync and seeds the preview data.
import { PowerSyncDatabase as WebPowerSyncDatabase, WASQLiteVFS } from '@powersync/web';
import { router } from 'expo-router';
import { LogBox } from 'react-native';

import { seedPreview } from './seed';

// The screenshot script navigates in the page, keeping the in-memory database.
(globalThis as any).__previewRouter = router;
LogBox.ignoreAllLogs(true);

export * from '@powersync/web';
export * from '@powersync/react';

const synced = (status: any) =>
  new Proxy(status, {
    get(target, prop) {
      if (prop === 'hasSynced' || prop === 'connected') return true;
      if (prop === 'connecting') return false;
      if (prop === 'lastSyncedAt') return new Date();
      const value = Reflect.get(target, prop, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });

export class PowerSyncDatabase extends WebPowerSyncDatabase {
  constructor(options: any) {
    super({
      ...options,
      database: {
        dbFilename: 'preview.db',
        vfs: WASQLiteVFS.InMemoryVfs,
        useWebWorker: false,
        enableMultiTabs: false,
      },
    });
    let real = (this as any).currentStatus;
    Object.defineProperty(this, 'currentStatus', {
      configurable: true,
      get: () => synced(real),
      set: (value) => {
        real = value;
      },
    });
    (globalThis as any).__previewDb = this;
    this.waitForReady()
      .then(() => seedPreview(this))
      .then(() => {
        (globalThis as any).__previewSeeded = true;
        this.iterateListeners((l: any) => l.statusChanged?.(this.currentStatus));
      })
      .catch((e) => console.error('[preview] seed failed', e));
  }

  async connect() {
    this.iterateListeners((l: any) => l.statusChanged?.(this.currentStatus));
  }
}
