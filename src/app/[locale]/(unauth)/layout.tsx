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
      <div className="pt-24 text-xl [&_ul]:my-6">{children}</div>
    </BaseTemplate>
  );
}
