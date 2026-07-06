'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { HomeTemplateInner } from './HomeTemplateInner';

export default function HomeTemplate({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <HomeTemplateInner>
        {children}
      </HomeTemplateInner>
    </SessionProvider>
  );
}
