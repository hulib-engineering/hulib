import type { ReactNode } from 'react';

import HomeTemplate from '@/templates/HomeTemplate';

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <HomeTemplate>
      <div className="pb-8 text-xl [&_ul]:my-6">{children}</div>
    </HomeTemplate>
  );
}
