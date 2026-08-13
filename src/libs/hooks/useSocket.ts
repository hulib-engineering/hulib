import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';

import { acquireSocket, releaseSocket } from '@/libs/services/socket';
import useAppSelector from './useAppSelector';

type UseSocketOptions<TEvents> = {
  namespace: 'notification' | 'chat' | string;
  listeners?: Partial<{ [K in keyof TEvents]: (payload: TEvents[K]) => void }>;
};

export const useSocket = <TEvents = Record<string, any>>({
  namespace,
  listeners = {},
}: UseSocketOptions<TEvents>) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // acquireSocket() may hand back a socket that other consumers are also
  // using (same namespace). off(event) would wipe their handlers too, so
  // each consumer tracks its own bound handlers and only ever removes
  // exactly those, by reference, instead of blanket-clearing the event.
  const boundHandlersRef = useRef<Map<string, (...args: any[]) => void>>(new Map());
  const listenersRef = useRef(listeners);
  useEffect(() => {
    listenersRef.current = listeners;
  }, [listeners]);

  // Every useSocket instance used to call next-auth's getSession() itself
  // on mount. AuthSessionSync keeps this in Redux, so read it from there
  // instead: no network call here at all.
  const { accessToken, isSessionHydrated } = useAppSelector(state => state.auth);

  const bindListeners = useCallback((socket: Socket) => {
    const bound = boundHandlersRef.current;
    Object.entries(listenersRef.current).forEach(([event, handler]) => {
      if (typeof handler !== 'function') {
        return;
      }
      const prev = bound.get(event);
      if (prev === handler) {
        return;
      }
      if (prev) {
        socket.off(event, prev);
      }
      socket.on(event, handler as (...args: any[]) => void);
      bound.set(event, handler as (...args: any[]) => void);
    });
  }, []);

  useEffect(() => {
    // Not hydrated yet, or hydrated-and-anonymous: nothing to connect with.
    // Once AuthSessionSync dispatches, isSessionHydrated/accessToken change
    // and this effect re-runs — still zero network calls made from here.
    if (!isSessionHydrated || !accessToken) {
      return undefined;
    }

    const socketInstance = acquireSocket(namespace, accessToken);
    socketRef.current = socketInstance;

    const handleConnect = () => {
      setIsConnected(true);
      bindListeners(socketInstance);
    };
    const handleDisconnect = () => setIsConnected(false);

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);

    // The shared socket may already be connected (another consumer got
    // there first) — in that case 'connect' won't fire again, so bind now.
    if (socketInstance.connected) {
      handleConnect();
    }

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      boundHandlersRef.current.forEach((handler, event) => socketInstance.off(event, handler));
      boundHandlersRef.current.clear();
      releaseSocket(namespace);
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [namespace, accessToken, isSessionHydrated, bindListeners]);

  // Re-bind whenever the caller's listeners object changes (most callers
  // pass an inline object, so this runs often — bindListeners is a no-op
  // per event whose handler reference hasn't actually changed).
  useEffect(() => {
    if (isConnected && socketRef.current) {
      bindListeners(socketRef.current);
    }
  }, [isConnected, listeners, bindListeners]);

  const emit = useCallback(
    (event: string, ...args: any[]) => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) {
        console.warn(`[${namespace}] Emit failed. Socket not connected.`);
        return;
      }
      socket.emit(event, ...args);
    },
    [namespace],
  );

  const reconnect = useCallback(() => {
    socketRef.current?.connect();
  }, []);

  return {
    socket: socketRef,
    isConnected,
    emit,
    reconnect,
  };
};
