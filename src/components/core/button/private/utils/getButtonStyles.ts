import type React from 'react';

import type { ButtonSettingsProps, ButtonVariants } from '../types';
import { mergeClassnames } from '@/components/core/private/utils';

export const getButtonCommonStyles = ({
  disabled,
}: Pick<ButtonSettingsProps, 'disabled'>): string =>
  mergeClassnames(
    'relative z-0 flex justify-center items-center font-medium no-underline overflow-hidden rounded-full gap-2',
    'whitespace-nowrap select-none transition duration-200 text-base leading-tight',
    disabled ? 'cursor-not-allowed' : 'active:scale-90',
    !disabled && 'transition-colors ease-out',
  );

export const getButtonVariants = ({
  variant,
  disabled,
  animation,
}: Pick<ButtonSettingsProps, 'variant' | 'disabled' | 'animation'>): string => {
  if (variant === 'outline') {
    return animation === 'error'
      ? mergeClassnames(
          'text-red-50 bg-transparent ring-inset ring-1 ring-red-50',
        )
      : mergeClassnames(
          'text-primary-50 bg-transparent border border-[#C2C6CF]',
          'disabled:border-neutral-90 disabled:text-neutral-70',
          !disabled
          && 'focus:text-primary-40',
        );
  }
  if (variant === 'ghost') {
    return animation === 'error'
      ? mergeClassnames('text-red-50 bg-transparent')
      : mergeClassnames(
          'text-primary-50 bg-transparent',
          disabled && 'text-neutral-70',
          !disabled
          && 'focus:border-2 focus:border-[#858DA0]',
        );
  }
  if (variant === 'soft') {
    return animation === 'error'
      ? mergeClassnames('text-red-50 bg-primary-90')
      : mergeClassnames(
          'text-primary-40 bg-primary-90',
          disabled && 'bg-neutral-90 text-neutral-70',
          !disabled
          && 'focus:ring-2 focus:ring-primary-60 focus:border focus:border-primary-80',
        );
  }
  return animation === 'error'
    ? 'text-white bg-red-50'
    : mergeClassnames(
        'text-white bg-primary-50',
        disabled && 'bg-neutral-90 text-neutral-70',
        !disabled
        && 'focus:ring-2 focus:ring-primary-80',
      );
};

type Props = { iconElement?: React.JSX.Element } & ButtonSettingsProps;

export const getIconHorizontalPosition = ({
  iconRight,
  iconLeft,
  size,
}: Pick<Props, 'iconRight' | 'iconLeft' | 'size'>): string => {
  if (iconRight) {
    return size === 'sm' ? 'end-1' : 'end-3';
  }
  if (iconLeft) {
    return size === 'sm' ? 'start-1' : 'start-3';
  }
  return '';
};

export const getLoaderColor = (variant?: ButtonVariants): string => {
  switch (variant) {
    case 'soft':
    case 'outline':
      return 'border-black';
    case 'ghost':
      return 'border-neutral-50';
    default:
      return 'border-white';
  }
};
