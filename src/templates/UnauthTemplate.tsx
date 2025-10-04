import type { ReactNode } from 'react';

import { poppins } from './BaseTemplate';
import { mergeClassnames } from '@/components/core/private/utils';

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
