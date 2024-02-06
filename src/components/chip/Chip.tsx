import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import { getPadding } from '@/components/chip/private/utils';
import { mergeClassnames } from '@/components/private/utils';

type IChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  iconOnly?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: 'sm' | 'md';
  isStroke?: boolean;
  variant?: 'default' | 'ghost';
  children?: React.ReactNode;
  className?: string;
};

const Chip = forwardRef<HTMLButtonElement, IChipProps>(
  (
    {
      children,
      // isActive,
      size = 'md',
      iconLeft,
      iconRight,
      iconOnly,
      // isStroke,
      variant = 'default',
      className,
      // disabled,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      {...rest}
      className={mergeClassnames(
        'z-0 overflow-hidden flex flex-row items-center justify-center text-slate-1000 relative',
        'rounded-sm cursor-pointer transition duration-200 space-between',
        size === 'sm' ? 'h-8 gap-1' : 'h-10 gap-2',
        variant === 'default' && 'bg-white',
        getPadding({ size, iconLeft, iconRight, iconOnly }),
        // getActive({ isActive, isStroke }),
        // getDisabled({ disabled, isStroke }),
        className,
      )}
      type="button"
    >
      {iconLeft}
      {children}
      {iconOnly}
      {iconRight}
    </button>
  ),
);

Chip.displayName = 'Chip';

export { Chip };
export type { IChipProps };
