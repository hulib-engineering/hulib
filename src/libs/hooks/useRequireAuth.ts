'use client';

import { useSession } from 'next-auth/react';

import { pushError } from '@/components/CustomToastifyContainer';
import { LOGIN_REQUIRED_MESSAGE } from '@/features/stories/constants';

type Action = () => void | Promise<void>;

const useRequireAuth = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const requireAuth = async (action: Action, message?: string): Promise<boolean> => {
    if (!isAuthenticated) {
      pushError(message ?? LOGIN_REQUIRED_MESSAGE);
      return false;
    }

    await action();
    return true;
  };

  return { requireAuth, isAuthenticated };
};

export { useRequireAuth };
