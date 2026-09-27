import { Manager, type Socket } from 'socket.io-client';

import { Env } from '@/libs/Env.mjs';

type ManagerEntry = {
  manager: Manager;
  token?: string;
};

type SocketEntry = {
  instance: Socket;
  refCount: number;
  teardownTimer?: ReturnType<typeof setTimeout>;
};

/**
 * Subscribers come and go in bursts: React StrictMode mounts every effect twice,
 * Fast Refresh remounts trees, and route changes unmount one consumer a tick
 * before the next one mounts. Tearing the connection down the instant the count
 * reaches zero turns each of those into a full disconnect/handshake cycle, so a
 * zeroed entry is kept alive briefly and revived if someone re-acquires.
 */
const TEARDOWN_GRACE_MS = 3_000;

// socket.io-client's own top-level `io()` cache multiplexes namespaces onto one
// Manager (one engine.io connection) *unless* the namespace it's about to hand
// out is still registered from a socket we haven't fully cleaned up yet — in
// that case it silently opens a second, independent Manager instead of reusing
// the first. That made 'chat' and 'notification' share one connection on first
// mount, then split into two after a destroy/recreate cycle (e.g. Fast Refresh).
// Owning the Manager ourselves and deriving namespace sockets from it via
// `manager.socket(nsp)` sidesteps that cache entirely: there is exactly one
// engine.io connection for as long as any namespace is in use. The map lives on
// globalThis so a Fast Refresh of this module doesn't orphan sockets the
// previous copy was holding.
const globalStore = globalThis as typeof globalThis & {
  __hulibSocketManager?: ManagerEntry;
  __hulibSocketInstances?: Map<string, SocketEntry>;
};

const instances: Map<string, SocketEntry>
  = globalStore.__hulibSocketInstances ?? new Map<string, SocketEntry>();
globalStore.__hulibSocketInstances = instances;

let managerEntry: ManagerEntry | undefined = globalStore.__hulibSocketManager;

// ---------------------------------------------------------------- DEBUG start
// Temporary instrumentation. Remove this block (and the `dbg*` calls below)
// once the duplicate-connection question is settled.
const DEBUG = process.env.NODE_ENV !== 'production';
// A different id per module copy: two ids in the log = this module got bundled
// or hot-reloaded twice, which means two independent socket.io Manager caches.
const MODULE_ID = Math.random().toString(36).slice(2, 6);
let managerSeq = 0;

const dbg = (...args: any[]) => {
  if (DEBUG) {
    console.log(`%c[socket:${MODULE_ID}]`, 'color:#0aa;font-weight:bold', ...args);
  }
};

const dbgCaller = () =>
  (new Error('trace').stack ?? '')
    .split('\n')
    .slice(3, 5)
    .map(line => line.trim().replace(/^at\s+/, ''))
    .join(' <- ');

// Tags the shared Manager (= one engine.io connection = one `sid`). Every
// namespace socket goes through this same tag now, since they all come off
// the one Manager instance.
const dbgManagerTag = (manager: Manager) => {
  const tagged = manager as Manager & { __hulibTag?: string };
  if (!tagged.__hulibTag) {
    managerSeq += 1;
    tagged.__hulibTag = `M${MODULE_ID}-${managerSeq}`;
  }
  return tagged.__hulibTag as string;
};

const dbgWatch = (namespace: string, instance: Socket) => {
  if (!DEBUG || !managerEntry) {
    return;
  }
  const tag = dbgManagerTag(managerEntry.manager);
  const { manager } = managerEntry;
  instance.on('connect', () =>
    dbg('CONNECT', namespace, tag, 'socket.id:', instance.id, 'sid:', (manager as any).engine?.id));
  instance.on('disconnect', (reason: string) => dbg('DISCONNECT', namespace, tag, reason));
};

// Watches the engine.io connection itself, once per Manager: which transport
// it opened with, and whether it ever upgrades from polling to websocket.
const dbgWatchManager = (manager: Manager) => {
  if (!DEBUG) {
    return;
  }
  const tag = dbgManagerTag(manager);
  manager.on('open', () => {
    const engine = (manager as any).engine;
    dbg('ENGINE OPEN', tag, 'sid:', engine?.id, 'transport:', engine?.transport?.name);
    engine?.on('upgrade', (transport: any) =>
      dbg('ENGINE UPGRADE', tag, 'now on:', transport?.name));
    engine?.on('upgradeError', (err: Error) =>
      dbg('ENGINE UPGRADE ERROR', tag, err?.message));
  });
  manager.on('close', (reason: string) => dbg('ENGINE CLOSE', tag, reason));
};

dbg('module evaluated');
// ------------------------------------------------------------------ DEBUG end

const destroySocketEntry = (namespace: string, entry: SocketEntry) => {
  dbg('DESTROY', namespace, managerEntry ? dbgManagerTag(managerEntry.manager) : '(no manager)');
  clearTimeout(entry.teardownTimer);
  entry.instance.removeAllListeners();
  entry.instance.disconnect();
  instances.delete(namespace);
};

const closeManager = () => {
  if (!managerEntry) {
    return;
  }
  dbg('CLOSE MANAGER', dbgManagerTag(managerEntry.manager));
  managerEntry.manager.removeAllListeners();
  managerEntry.manager._close();
  managerEntry = undefined;
  globalStore.__hulibSocketManager = undefined;
};

type AcquireOptions = {
  /** Passed to socket.io as `reconnectionAttempts`; only the first acquirer (of any namespace) sets it. */
  maxRetries?: number;
};

const ensureManager = (authToken: string | undefined, { maxRetries }: AcquireOptions): Manager => {
  if (managerEntry && managerEntry.token === authToken) {
    return managerEntry.manager;
  }

  // Token changed (e.g. re-login) or no manager yet — the old connection, if
  // any, is no longer valid for every namespace riding on it.
  if (managerEntry) {
    dbg('RECREATE MANAGER (token changed)', dbgManagerTag(managerEntry.manager));
    instances.forEach((entry, namespace) => destroySocketEntry(namespace, entry));
    closeManager();
  }

  const manager = new Manager(Env.NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT, {
    withCredentials: true,
    autoConnect: false,
    reconnectionAttempts: maxRetries,
    extraHeaders: {
      authorization: `Bearer ${authToken ?? ''}`,
    },
  });

  managerEntry = { manager, token: authToken };
  globalStore.__hulibSocketManager = managerEntry;
  dbg('CREATE MANAGER', dbgManagerTag(manager));
  dbgWatchManager(manager);

  return manager;
};

export const acquireSocket = (
  namespace: string,
  authToken?: string,
  options: AcquireOptions = {},
): Socket => {
  const manager = ensureManager(authToken, options);

  const existing = instances.get(namespace);
  if (existing) {
    // Revive it if it was sitting in the grace window.
    const revived = Boolean(existing.teardownTimer);
    clearTimeout(existing.teardownTimer);
    existing.teardownTimer = undefined;
    existing.refCount += 1;

    dbg(
      revived ? 'REUSE (revived from grace)' : 'REUSE',
      namespace,
      dbgManagerTag(manager),
      'refCount:',
      existing.refCount,
      'connected:',
      existing.instance.connected,
      'active:',
      existing.instance.active,
      '|',
      dbgCaller(),
    );

    if (!existing.instance.connected && !existing.instance.active) {
      dbg('RECONNECT', namespace);
      existing.instance.connect();
    }
    return existing.instance;
  }

  dbg(
    'CREATE',
    namespace,
    dbgManagerTag(manager),
    'known namespaces:',
    [...instances.keys()],
    '|',
    dbgCaller(),
  );

  // Reuses the namespace's socket if the Manager already has one registered,
  // otherwise creates one bound to this Manager — never a second connection.
  const instance = manager.socket(`/${namespace}`, {});
  dbgWatch(namespace, instance);

  instances.set(namespace, {
    instance,
    refCount: 1,
  });
  instance.connect();

  return instance;
};

export const releaseSocket = (namespace: string) => {
  const entry = instances.get(namespace);
  if (!entry) {
    return;
  }

  entry.refCount = Math.max(0, entry.refCount - 1);
  if (entry.refCount > 0 || entry.teardownTimer) {
    return;
  }

  entry.teardownTimer = setTimeout(() => {
    // Still unused after the grace window — nobody came back for it.
    if (instances.get(namespace) === entry && entry.refCount === 0) {
      destroySocketEntry(namespace, entry);
      if (instances.size === 0) {
        closeManager();
      }
    }
  }, TEARDOWN_GRACE_MS);
};

/** Drop every connection regardless of subscribers, e.g. on logout. */
export const closeAllSockets = () => {
  instances.forEach((entry, namespace) => destroySocketEntry(namespace, entry));
  closeManager();
};
