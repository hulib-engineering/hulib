'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';

import { AdminTemplate } from '@/templates/AdminTemplate';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return (
    <AdminTemplate>
      <Suspense fallback={null}>{children}</Suspense>
    </AdminTemplate>
  );
}
