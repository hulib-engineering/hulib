import { getSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';

import { socket as createSocket } from '@/libs/services/socket';

type UseSocketOptions<TEvents> = {
  namespace: 'notification' | 'chat' | string;
  listeners?: Partial<{ [K in keyof TEvents]: (payload: TEvents[K]) => void }>;
  cleanupOnUnmount?: boolean;
};

export const useSocket = <TEvents = Record<string, any>>({
  namespace,
  listeners = {},
  cleanupOnUnmount = true,
}: UseSocketOptions<TEvents>) => {
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef(listeners);
  listenersRef.current = listeners;
  const [isConnected, setIsConnected] = useState(false);

  const bindListeners = useCallback(
    (socket: Socket) => {
      Object.entries(listenersRef.current).forEach(([event, handler]) => {
        if (typeof handler === 'function') {
          socket.off(event);
          socket.on(event, handler as (...args: any[]) => void);
        }
      });
    },
    [],
  );

  useEffect(() => {
    let active = true;

    const initSocket = async () => {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token || !active) {
        return;
      }

      const socketInstance = createSocket(namespace, token);
      socketRef.current = socketInstance;

      socketInstance.on('connect', () => {
        setIsConnected(true);
        bindListeners(socketInstance);
      });

      socketInstance.on('disconnect', () => {
        console.warn(`[${namespace}] disconnected`);
        setIsConnected(false);
      });

      socketInstance.on('error', (err: Error) => {
        console.error(`[${namespace}] Socket error:`, err);
      });

      socketInstance.connect();
    };

    initSocket();

    return () => {
      active = false;
      const socketInstance = socketRef.current;
      if (socketInstance) {
        socketInstance.removeAllListeners();
        if (cleanupOnUnmount) {
          socketInstance.disconnect();
        }
        socketRef.current = null;
      }
    };
  }, [namespace, bindListeners, cleanupOnUnmount]);

  useEffect(() => {
    if (isConnected && socketRef.current) {
      bindListeners(socketRef.current);
    }
  }, [isConnected, bindListeners]);

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
