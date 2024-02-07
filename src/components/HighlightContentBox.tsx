import React, { type ReactNode } from 'react';

import { mergeClassnames } from '@/components/private/utils';

type IHighlightContentBoxProps = {
  className: string;
  children: ReactNode;
};

const HighlightContentBox = ({
  className,
  children,
}: IHighlightContentBoxProps) => (
  <div
    className={mergeClassnames(
      'rounded-lg bg-[#ffffff4c] px-2 py-3 sm:p-4 shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden',
      'backdrop-blur-[20px]',
      'before:content-[""] before:bg-white before:bg-opacity-50 before:absolute before:top-[-50%] before:left-[-3rem] before:transition-all before:duration-1000 before:w-6 before:h-[200%] before:rotate-[-15deg]',
      'hover:before:left-[110%] hover:before:transition-all hover:before:duration-1000',
      className,
    )}
  >
    {children}
  </div>
);

export { HighlightContentBox };
