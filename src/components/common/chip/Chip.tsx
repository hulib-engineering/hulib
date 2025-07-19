import type { ElementType } from 'react';
import React, { forwardRef } from 'react';

import type { PolymorphicRef } from '@/components/private/types';
import { mergeClassnames } from '@/components/private/utils';

import type { ChipPolymorphicProps } from './private/type';
import { getActive, getDisabled, getPadding } from './private/utils';

const Chip = forwardRef(
  // @ts-ignore
  <C extends ElementType = 'button'>(
    {
      children,
      isActive,
      size = 'md',
      iconLeft,
      iconRight,
      iconOnly,
      isStroke,
      variant = 'default',
      className,
      disabled,
      as,
      ...rest
    }: ChipPolymorphicProps<C>,
    ref?: PolymorphicRef<C>,
  ) => {
    const Component = as || 'button';

    return (
      <Component
        ref={ref}
        {...rest}
        className={mergeClassnames(
          'z-0 overflow-hidden flex flex-row items-center justify-center text-slate-1000 relative',
          'rounded-sm cursor-pointer transition duration-200 space-between',
          size === 'sm' ? 'h-8 gap-1' : 'h-10 gap-2',
          variant === 'default' && 'bg-white',
          getPadding({ size, iconLeft, iconRight, iconOnly }),
          getActive({ isActive, isStroke }),
          getDisabled({ disabled, isStroke }),
          className,
        )}
        {...((!as || as === 'button') && { type: 'button' })}
      >
        {iconLeft}
        {children}
        {iconOnly}
        {iconRight}
      </Component>
    );
  },
);
Chip.displayName = 'Chip';

export { Chip };
