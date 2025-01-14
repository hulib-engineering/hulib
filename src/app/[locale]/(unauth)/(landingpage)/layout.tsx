import type { ReactNode } from 'react';

import { BaseTemplate } from '@/templates/BaseTemplate';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return (
    <BaseTemplate>
      <div className="w-screen pb-8 pt-24 text-xl [&_ul]:my-6">{children}</div>
    </BaseTemplate>
  );
}
