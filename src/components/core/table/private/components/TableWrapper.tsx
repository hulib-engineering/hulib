'use client';

import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef } from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

type TableWrapperProps = ComponentPropsWithoutRef<'div'> & {
  isScrolledToLeft: boolean;
  isScrolledToRight: boolean;
  style?: CSSProperties;
  children: ReactNode;
};

const TableWrapper = forwardRef<HTMLDivElement, TableWrapperProps>(
  (
    {
      isScrolledToLeft,
      isScrolledToRight,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      {...rest}
      style={style}
      className={mergeClassnames(
        'flex flex-1 flex-col overflow-x-auto rounded border border-neutral-80',
        !isScrolledToLeft && 'shadow-[inset_6px_0_9px_-10px_rgba(0,0,0,0.15)]',
        !isScrolledToRight && 'shadow-[inset_-6px_0_9px_-10px_rgba(0,0,0,0.15)]',
        className,
      )}
    >
      {children}
    </div>
  ),
);

TableWrapper.displayName = 'TableWrapper';

export default TableWrapper;
