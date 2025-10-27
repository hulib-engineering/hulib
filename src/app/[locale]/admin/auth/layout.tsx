'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>{children}</SessionProvider>
  );
}
