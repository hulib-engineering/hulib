import type { ElementType } from 'react';
import React from 'react';

import type {
  ButtonProps,
  ButtonSettingsProps,
  ButtonVariants,
} from './private/types';
import {
  getButtonCommonStyles,
  getButtonVariants,
  getIconHorizontalPosition,
} from './private/utils/getButtonStyles';
import getAnimation from '@/components/button/private/utils/getButtonAnimation';
import {
  getButtonSizes,
  getIconSize,
} from '@/components/button/private/utils/getButtonSizes';
import { mergeClassnames } from '@/components/private/utils';

const ButtonComponent = <C extends ElementType>({
  variant,
  size,
  icon, // deprecated
  iconLeft,
  iconRight,
  iconOnly, // deprecated
  fullWidth,
  disabled,
  animation,
  as,
  customClassName,
  ...rest
}: ButtonProps<C>) => {
  const Component = as || 'button';

  return (
    <Component
      className={mergeClassnames(
        getButtonSizes({
          size,
          icon,
          iconLeft,
          iconRight,
          iconOnly,
          fullWidth,
        }),
        getButtonCommonStyles({ disabled }),
        getButtonVariants({ variant, disabled, animation }),
        animation === 'pulse'
        && (variant === 'fill' || variant === 'primary')
        && getAnimation('pulse'),
        animation === 'error' && getAnimation('error'),
        fullWidth && !iconOnly && 'w-full',
        customClassName,
      )}
      {...((!as || as === 'button') && { type: 'button' })}
      {...(disabled && { disabled })}
      {...rest}
    />
  );
};

const Hover = ({
  isHover,
  variant,
}: {
  isHover: boolean;
  variant: ButtonVariants;
}) => {
  const hoverBackground
    = variant === 'ghost'
      ? 'bg-light-active'
      : variant === 'outline'
        ? 'bg-light-hover'
        : 'bg-primary-40';

  return (
    <span
      aria-hidden="true"
      className={mergeClassnames(
        'z-[-1] block absolute inset-0 pointer-events-none',
        'transition-colors duration-300',
        isHover ? hoverBackground : '',
      )}
    />
  );
};

const IconLeft = ({ fullWidth, iconLeft, size }: ButtonSettingsProps) => (
  <span
    aria-hidden="true"
    className={mergeClassnames(
      getIconSize(size),
      fullWidth
      && `absolute block top-1/2 translate-y-[-50%] ${getIconHorizontalPosition({
        iconLeft,
        size,
      })}`,
    )}
  >
    {iconLeft}
  </span>
);

const IconRight = ({ fullWidth, iconRight, size }: ButtonSettingsProps) => (
  <span
    aria-hidden="true"
    className={mergeClassnames(
      getIconSize(size),
      fullWidth
      && `absolute block top-1/2 translate-y-[-50%] ${getIconHorizontalPosition({
        iconRight,
        size,
      })}`,
    )}
  >
    {iconRight}
  </span>
);

export { ButtonComponent, Hover, IconLeft, IconRight };
