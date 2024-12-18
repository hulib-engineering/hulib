import type { ReactNode } from 'react';

import { MainTemplate } from '@/templates/MainTemplate';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return (
    <MainTemplate>
      <div className="w-screen pb-8 pt-16 text-xl sm:pt-20 [&_ul]:my-6">
        {children}
      </div>
    </MainTemplate>
  );
}
