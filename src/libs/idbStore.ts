// Must match idb-keyval defaults so existing drafts stay readable. Do NOT change.
const DB_NAME = 'keyval-store';
const STORE_NAME = 'keyval';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | undefined;

function openDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE_NAME)) {
          req.result.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        const reset = () => {
          dbPromise = undefined;
        };
        db.onclose = reset;
        db.onversionchange = () => {
          db.close();
          reset();
        };
        resolve(db);
      };
      req.onerror = () => {
        dbPromise = undefined;
        reject(req.error);
      };
      req.onblocked = () => {
        dbPromise = undefined;
        reject(new Error('IndexedDB open blocked'));
      };
    });
  }
  return dbPromise;
}

// `fn` queues requests and returns a getter; the getter runs after the transaction commits.
async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => () => T,
): Promise<T> {
  const db = await openDB();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    let read: () => T;
    tx.oncomplete = () => resolve(read());
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
    tx.onerror = () => reject(tx.error);
    try {
      read = fn(tx.objectStore(STORE_NAME));
    } catch (err) {
      tx.abort();
      reject(err);
    }
  });
}

export function get<T = unknown>(key: IDBValidKey): Promise<T | undefined> {
  return withStore('readonly', (store) => {
    const req = store.get(key);
    return () => req.result as T | undefined;
  });
}

export function getMany<T = unknown>(keys: IDBValidKey[]): Promise<(T | undefined)[]> {
  return withStore('readonly', (store) => {
    const reqs = keys.map(k => store.get(k));
    return () => reqs.map(r => r.result as T | undefined);
  });
}

export function set(key: IDBValidKey, value: unknown): Promise<void> {
  return withStore('readwrite', (store) => {
    store.put(value, key);
    return () => undefined;
  });
}

export function del(key: IDBValidKey): Promise<void> {
  return withStore('readwrite', (store) => {
    store.delete(key);
    return () => undefined;
  });
}

export function delMany(keys: IDBValidKey[]): Promise<void> {
  return withStore('readwrite', (store) => {
    keys.forEach(k => store.delete(k));
    return () => undefined;
  });
}

export function keys(): Promise<IDBValidKey[]> {
  return withStore('readonly', (store) => {
    const req = store.getAllKeys();
    return () => req.result;
  });
}
