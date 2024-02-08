import React, { forwardRef } from 'react';

import { getPadding } from '@/components/chip/private/utils';
import { mergeClassnames } from '@/components/private/utils';

type IChipProps = {
  isActive?: boolean;
  iconOnly?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: 'sm' | 'md';
  isStroke?: boolean;
  variant?: 'default' | 'ghost';
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const Chip = forwardRef<HTMLDivElement, IChipProps>(
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
    <div
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
      // type="button"
    >
      {iconLeft}
      {children}
      {iconOnly}
      {iconRight}
    </div>
  ),
);

Chip.displayName = 'Chip';

export { Chip };
export type { IChipProps };
