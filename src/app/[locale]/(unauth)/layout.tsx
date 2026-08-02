'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

import LazyToastContainer from '@/components/LazyToastContainer';

export default function UnauthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
      <LazyToastContainer />
    </SessionProvider>
  );
}
