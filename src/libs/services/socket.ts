import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import { Env } from '@/libs/Env.mjs';

const MAX_RETRIES = 3;

type SharedEntry = {
  socket: Socket;
  refCount: number;
  retryCount: number;
};

// Every useSocket() consumer for a given namespace (Header's notification +
// chat sockets, MessengerWidget, and one per open chat window) used to open
// its own real long-polling connection (socket.io-client's io() factory
// deliberately does NOT dedupe repeat connections to the same namespace).
// With several consumers mounted at once that ate the browser's ~6-per-host
// connection limit and stalled every other request on the page for 10s+.
// Reuse one real Socket per namespace instead, reference-counted so it's
// connected once and only torn down once the last consumer releases it.
const registry = new Map<string, SharedEntry>();

export function acquireSocket(namespace: string, authToken: string): Socket {
  let entry = registry.get(namespace);

  if (!entry) {
    const instance = io(`${Env.NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT}/${namespace}`, {
      withCredentials: true,
      autoConnect: false,
      extraHeaders: {
        authorization: `Bearer ${authToken}`,
      },
    });

    const sharedEntry: SharedEntry = { socket: instance, refCount: 0, retryCount: 0 };

    instance.on('disconnect', () => {
      console.warn(`[${namespace}] disconnected`);
    });
    instance.on('error', (err: Error) => {
      console.error(`[${namespace}] Socket error:`, err);
    });
    instance.io.on('reconnect_attempt', () => {
      sharedEntry.retryCount += 1;
      if (sharedEntry.retryCount > MAX_RETRIES) {
        console.warn(`[${namespace}] Max retries exceeded. Disconnecting.`);
        instance.disconnect();
      }
    });

    instance.connect();

    entry = sharedEntry;
    registry.set(namespace, entry);
  }

  entry.refCount += 1;
  return entry.socket;
}

export function releaseSocket(namespace: string): void {
  const entry = registry.get(namespace);
  if (!entry) {
    return;
  }

  entry.refCount -= 1;
  if (entry.refCount <= 0) {
    entry.socket.removeAllListeners();
    entry.socket.disconnect();
    registry.delete(namespace);
  }
}
