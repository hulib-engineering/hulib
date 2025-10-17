'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

import { UnauthTemplate } from '@/templates/UnauthTemplate';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <UnauthTemplate>{children}</UnauthTemplate>
    </SessionProvider>
  );
}
