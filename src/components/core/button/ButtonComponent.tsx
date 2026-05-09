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
import getAnimation from '@/components/core/button/private/utils/getButtonAnimation';
import {
  getButtonSizes,
  getIconSize,
} from '@/components/core/button/private/utils/getButtonSizes';
import { mergeClassnames } from '@/components/core/private/utils';

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

type HoverConfig = { normal: string; error?: string };

const HOVER_BACKGROUNDS: Record<ButtonVariants, HoverConfig> = {
  fill: { normal: 'bg-primary-40' },
  primary: { normal: 'bg-primary-40' },
  secondary: { normal: 'bg-primary-80', error: 'bg-chichi-10' },
  tertiary: { normal: 'bg-primary-98' },
  ghost: { normal: 'bg-primary-98', error: 'bg-red-10' },
  outline: { normal: 'bg-light-hover', error: 'bg-red-10' },
};

const Hover = ({
  isHover,
  variant,
  animation,
}: {
  isHover: boolean;
  variant: ButtonVariants;
  animation?: ButtonSettingsProps['animation'];
}) => {
  const config = HOVER_BACKGROUNDS[variant];
  const hoverBg
    = animation === 'error' && config.error ? config.error : config.normal;

  return (
    <span
      aria-hidden="true"
      className={mergeClassnames(
        'z-[-1] block absolute inset-0 pointer-events-none',
        'transition-colors duration-200 ease-out',
        isHover ? hoverBg : '',
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
