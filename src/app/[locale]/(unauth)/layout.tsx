'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

import CustomToastifyContainer from '@/components/CustomToastifyContainer';

export default function UnauthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
      <CustomToastifyContainer />
    </SessionProvider>
  );
}
