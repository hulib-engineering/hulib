import type { ReactNode } from 'react';
import React from 'react';

import FooterWebApp from '@/layouts/FooterWebApp';
import HeaderWebApp from '@/layouts/HeaderWebApp';

type IMemberLayoutProps = {
  children: ReactNode;
};

const MemberLayout = (props: IMemberLayoutProps) => {
  return (
    <div className="flex h-screen w-full flex-col items-center">
      <HeaderWebApp />
      <div className="h-screen w-full">{props.children}</div>
      <FooterWebApp />
    </div>
  );
};

export { MemberLayout };
