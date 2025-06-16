import { getSession } from 'next-auth/react';
import { io } from 'socket.io-client';

import { Env } from '@/libs/Env.mjs';

export const socket = async (namespace: string) =>
  io(`${Env.NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT}/${namespace}`, {
    withCredentials: true,
    forceNew: true,
    // transports: ['polling'],
    autoConnect: false,
    extraHeaders: {
      // @ts-ignore
      authorization: `Bearer ${(await getSession())?.accessToken ?? ''}`,
    },
  });
