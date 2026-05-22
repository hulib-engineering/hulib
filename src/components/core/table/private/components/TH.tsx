'use client';

import type { ThHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

type THProps = ThHTMLAttributes<HTMLTableCellElement>;

const TH = forwardRef<HTMLTableCellElement, THProps>(
  ({ className, children, ...rest }, ref) => (
    <th
      ref={ref}
      {...rest}
      className={mergeClassnames(
        'bg-primary-98 pb-4 pt-3 px-4 text-base font-medium leading-6 tracking-wide text-primary-60',
        'relative text-left',
        className,
      )}
    >
      {children}
    </th>
  ),
);

TH.displayName = 'TH';

export default TH;
