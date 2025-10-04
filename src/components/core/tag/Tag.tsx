import React from 'react';
import type { TagProps } from './private/types';
import { mergeClassnames } from '@/components/core/private/utils';

const Tag = ({
  children,
  iconLeft,
  iconRight,
  // size = 'xs',
  // isUppercase = true,
  className,
  onClick,
}: TagProps) => (
  <div
    role="button"
    tabIndex={-1}
    className={mergeClassnames(
      'flex w-fit items-center rounded-2xl p-2 gap-1 select-none text-primary-60 bg-primary-90 border border-primary-80',
      // getSize({ size, iconRight, iconLeft }),
      // getFontSize({ isUppercase, size }),
      className,
    )}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (onClick) {
          onClick();
        }
      }
    }}
  >
    {iconLeft && <span>{iconLeft}</span>}
    {children}
    {iconRight && <span>{iconRight}</span>}
  </div>
);

export default Tag;
