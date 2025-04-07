import type { ReactNode } from 'react';

import { MainTemplate } from '@/templates/MainTemplate';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return <MainTemplate>{children}</MainTemplate>;
}
