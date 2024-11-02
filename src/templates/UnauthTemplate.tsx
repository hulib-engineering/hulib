import { type ReactNode } from 'react';

import { mergeClassnames } from '@/components/private/utils';

import { poppins } from './BaseTemplate';

type IUnauthTemplateProps = {
  children: ReactNode;
};

const UnauthTemplate = ({ children }: IUnauthTemplateProps) => (
  <div
    className={mergeClassnames(
      poppins.className,
      'flex flex-col md:flex-row min-h-screen w-full items-center justify-center gap-8 bg-white',
    )}
  >
    {children}
  </div>
);

export { UnauthTemplate };
