import type { ReactNode } from 'react';

import { UnauthTemplate } from '@/templates/UnauthTemplate';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return <UnauthTemplate>{children}</UnauthTemplate>;
}
