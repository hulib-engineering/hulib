'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import AuthSessionSync from '@/components/AuthSessionSync';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthSessionSync />
      {children}
    </SessionProvider>
  );
}
