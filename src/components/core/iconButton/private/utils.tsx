import { Check } from '@phosphor-icons/react';
import React from 'react';

import type {
  ButtonAnimations,
  ButtonSettingsProps,
} from '@/components/core/button/private/types';
import {
  getIconSize,
  getLoaderSize,
} from '@/components/core/button/private/utils/getButtonSizes';
import { getLoaderColor } from '@/components/core/button/private/utils/getButtonStyles';
import type { IconButtonSettingsProps, IconButtonSizes } from '@/components/core/iconButton/private/types';
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

export const getButtonSize = (size?: IconButtonSizes): string => {
  if (size === 'sm') {
    return 'size-8 p-2 text-base';
  }
  if (size === 'lg') {
    return 'size-11 p-3 text-xl';
  }
  return 'size-10 p-2.5 text-xl';
};

export const getButtonVariants = ({
  variant,
  disabled,
  animation,
}: Pick<ButtonSettingsProps, 'variant' | 'disabled' | 'animation'>): string => {
  if (variant === 'outline') {
    return animation === 'error'
      ? mergeClassnames(
          'text-red-50 bg-transparent ring-inset ring-1 ring-red-50',
          !disabled && 'hover:bg-red-90',
        )
      : mergeClassnames(
          'text-neutral-20 bg-transparent border border-neutral-variant-80',
          disabled && 'border-neutral-90 text-neutral-70',
          !disabled && 'hover:bg-neutral-90 focus:bg-neutral-90 focus:ring-2 focus:ring-primary-60',
        );
  }
  if (variant === 'soft') {
    return animation === 'error'
      ? mergeClassnames('text-red-50 bg-primary-90')
      : mergeClassnames(
          'bg-primary-90 text-primary-40 border border-primary-90',
          disabled && 'text-neutral-70 border-neutral-90 bg-neutral-90',
          !disabled && 'hover:bg-primary-80 hover:border-primary-80 focus:border-primary-50 focus:ring-2 focus:ring-primary-60',
        );
  }
  if (variant === 'ghost') {
    return animation === 'error'
      ? mergeClassnames(
          'text-red-50 bg-transparent',
          !disabled && 'hover:bg-red-90',
        )
      : mergeClassnames(
          'text-neutral-20 bg-transparent border border-transparent',
          disabled && 'text-neutral-70',
          !disabled && 'hover:bg-neutral-90 hover:border-neutral-90 focus:bg-neutral-90 focus:border-neutral-90 focus:ring-2 focus:ring-primary-60',
        );
  }
  return animation === 'error'
    ? 'text-white bg-red-50'
    : mergeClassnames(
        'text-white bg-primary-50 border border-primary-60',
        disabled && 'bg-neutral-90 border-neutral-90 text-neutral-70',
        !disabled && 'hover:bg-primary-40 focus:border-primary-40 focus:border-primary-50',
      );
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
