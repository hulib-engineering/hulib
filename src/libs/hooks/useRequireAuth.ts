'use client';

import { useSession } from 'next-auth/react';

type Action = () => void | Promise<void>;

const useRequireAuth = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const requireAuth = async (action: Action): Promise<boolean> => {
    if (!isAuthenticated) {
      return false;
    }

    await action();
    return true;
  };

  return { requireAuth, isAuthenticated };
};

export { useRequireAuth };
