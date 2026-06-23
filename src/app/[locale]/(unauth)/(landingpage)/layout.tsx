import type { ReactNode } from 'react';

import HomeTemplate from '@/templates/HomeTemplate';

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <HomeTemplate>{children}</HomeTemplate>;
}
