'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { MainTemplate } from '@/templates/MainTemplate';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith('/register-huber/create-book')) {
    return <>{children}</>;
  }
  return <MainTemplate>{children}</MainTemplate>;
}
