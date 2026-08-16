'use client';

import { useSession } from 'next-auth/react';
import type { ReactNode } from 'react';
import { MainTemplate } from '@/templates/MainTemplate';
import HomeTemplate from '@/templates/HomeTemplate';

export default function ConditionalTemplate({ children }: { children: ReactNode }) {
  const { status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    return <MainTemplate>{children}</MainTemplate>;
  }

  return <HomeTemplate>{children}</HomeTemplate>;
}
