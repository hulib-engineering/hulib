import { getSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';

import { socket as createSocket } from '@/libs/services/socket';

type UseSocketOptions<TEvents> = {
  namespace: 'notification' | 'chat' | string;
  listeners?: Partial<{ [K in keyof TEvents]: (payload: TEvents[K]) => void }>;
  maxRetries?: number;
  cleanupOnUnmount?: boolean;
};

export const useSocket = <TEvents = Record<string, any>>({
  namespace,
  listeners = {},
  maxRetries = 3,
  cleanupOnUnmount = true,
}: UseSocketOptions<TEvents>) => {
  const socketRef = useRef<Socket | null>(null);
  const retryCountRef = useRef(0);
  const [isConnected, setIsConnected] = useState(false);

  const bindListeners = useCallback(
    (socket: Socket) => {
      Object.entries(listeners).forEach(([event, handler]) => {
        if (typeof handler === 'function') {
          socket.off(event); // remove any existing handlers for this event
          socket.on(event, handler as (...args: any[]) => void);
        }
      });
    },
    [listeners],
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

      socketInstance.on('message', (msg) => {
        console.log(`[${namespace}] Default message:`, msg);
      });

      socketInstance.onAny((event, ...args) => {
        console.debug(`[${namespace}] [onAny] ${event}`, ...args);
      });

      socketInstance.io.on('reconnect_attempt', () => {
        retryCountRef.current += 1;
        if (retryCountRef.current > maxRetries) {
          console.warn(`[${namespace}] Max retries exceeded. Disconnecting.`);
          socketInstance.disconnect();
        }
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
  }, [namespace, bindListeners, maxRetries, cleanupOnUnmount]);

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
    retryCountRef.current = 0;
    socketRef.current?.connect();
  }, []);

  return {
    socket: socketRef,
    isConnected,
    emit,
    reconnect,
  };
};
