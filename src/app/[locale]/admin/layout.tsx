'use client';

import type { ReactNode } from 'react';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return (
    <>{children}</>
  );
}
