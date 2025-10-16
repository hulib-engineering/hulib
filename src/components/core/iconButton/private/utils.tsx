import { Check } from '@phosphor-icons/react';
import React from 'react';

import type {
  ButtonAnimations,
  ButtonSettingsProps,
  ButtonSizes,
} from '@/components/core/button/private/types';
import {
  getIconSize,
  getLoaderSize,
} from '@/components/core/button/private/utils/getButtonSizes';
import { getLoaderColor } from '@/components/core/button/private/utils/getButtonStyles';
import type { IconButtonSettingsProps } from '@/components/core/iconButton/private/types';
import Loader from '@/components/core/loader/Loader';
import { mergeClassnames } from '@/components/core/private/utils';

const AnimationContent = ({
  children,
  icon,
  animation,
  size,
  variant,
}: IconButtonSettingsProps) => (
  <span className="pointer-events-none relative block h-full">
    <span className="absolute left-1/2 top-1/2 flex place-content-center -translate-x-1/2 -translate-y-1/2">
      {animation === 'progress' && (
        <Loader color={getLoaderColor(variant)} size={getLoaderSize(size)} />
      )}
      {animation === 'success' && (
        <Check aria-label="Success" className={getIconSize(size)} />
      )}
    </span>
    <span className="block opacity-0">
      {icon}
      {children}
    </span>
  </span>
);

export const getButtonSize = (size?: ButtonSizes): string => {
  if (size === 'sm') {
    return 'h-8 p-2 text-base';
  }
  if (size === 'lg') {
    return 'h-11 p-3 text-xl';
  }
  return 'h-10 p-[10px] text-xl';
};

export const getButtonVariants = ({
  variant,
  disabled,
  animation,
}: Pick<ButtonSettingsProps, 'variant' | 'disabled' | 'animation'>): string => {
  if (variant === 'outline') {
    return animation === 'error'
      ? mergeClassnames(
          'text-chichi bg-transparent ring-inset ring-1 ring-chichi',
          !disabled && 'hover:bg-chichi-10',
        )
      : mergeClassnames(
          'text-neutral-20 bg-transparent border border-[#C2C6CF]',
          !disabled && 'hover:bg-neutral-90',
        );
  }
  if (variant === 'secondary' || variant === 'tertiary') {
    return animation === 'error'
      ? 'text-goten bg-chichi'
      : mergeClassnames(
          'border-primary-90 bg-primary-90 text-primary-40',
          'focus:border-primary-50 focus:bg-primary-90 focus:drop-shadow-[0_0_0_2px] focus:drop-shadow-primary-60',
          !disabled ? 'hover:border-primary-80 hover:bg-primary-80' : 'border-neutral-90 bg-neutral-90 text-neutral-70',
        );
  }
  if (variant === 'ghost') {
    return animation === 'error'
      ? mergeClassnames(
          'text-chichi bg-transparent',
          !disabled && 'hover:bg-chichi-10',
        )
      : mergeClassnames(
          'text-neutral-20 bg-transparent',
          'hover:bg-neutral-90 hover:border hover:border-solid hover:border-neutral-90',
          'focus:bg-neutral-90 focus:shadow-[0 0 0 2px focus:shadow-primary-60',
        );
  }
  return animation === 'error'
    ? 'text-white bg-chichi'
    : 'text-white bg-primary-50 focus:shadow-[0 0 0 2px] focus:shadow-primary-80';
};

type Props = {
  ariaLabel?: string;
  animation?: ButtonAnimations;
};

export const getAriaLabel = ({ ariaLabel, animation }: Props): string | undefined =>
  ariaLabel
  || (animation === 'error'
    ? 'Error'
    : animation === 'progress' || animation === 'success'
      ? undefined
      : 'IconButton');

export { AnimationContent };
