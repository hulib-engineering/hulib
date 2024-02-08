// import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { BaseTemplate } from '@/templates/BaseTemplate';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  // const t = useTranslations('RootLayout');

  return (
    <BaseTemplate>
      <div className="w-screen pb-8 pt-16 text-xl sm:pt-24 [&_ul]:my-6">
        {children}
      </div>
    </BaseTemplate>
  );
}
