'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAppDispatch } from '@/libs/hooks';
import { setAccessToken } from '@/libs/store/authentication';

// Mirrors the NextAuth session's accessToken into Redux so RTK Query
// (src/libs/services/api.ts) can read it synchronously from the store
// instead of calling next-auth's getSession() on every single request.
const AuthSessionSync = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 'loading' means next-auth hasn't resolved the session yet — wait for it.
    // Dispatch even when there's no accessToken (anonymous) so the store is
    // marked hydrated and prepareHeaders stops falling back to getSession().
    if (status === 'loading') {
      return;
    }
    dispatch(setAccessToken(session?.accessToken ?? ''));
  }, [status, session?.accessToken, dispatch]);

  return null;
};

export default AuthSessionSync;
