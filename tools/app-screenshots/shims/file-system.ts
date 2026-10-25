// Web-only stand-in for expo-file-system (screenshot preview): no local files, so photos come
// from (mocked) storage.
class Entry {
  uri: string;
  constructor(...parts: (string | Entry)[]) {
    this.uri = parts.map((p) => (typeof p === 'string' ? p : p.uri)).join('/');
  }
  get exists() {
    return false;
  }
  get name() {
    return this.uri.split('/').pop() ?? '';
  }
  create() {}
  delete() {}
  copySync() {}
  moveSync() {}
  copy() {}
  move() {}
}

export class File extends Entry {
  size = 0;
  async arrayBuffer() {
    return new ArrayBuffer(0);
  }
  async text() {
    return '';
  }
  async base64() {
    return '';
  }
  write() {}
}

export class Directory extends Entry {
  list() {
    return [];
  }
}

export const Paths = {
  get document() {
    return new Directory('file:///document');
  },
  get cache() {
    return new Directory('file:///cache');
  },
};
