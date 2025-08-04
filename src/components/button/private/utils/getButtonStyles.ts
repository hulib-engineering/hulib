import type React from 'react';

import type { ButtonSettingsProps, ButtonVariants } from '../types';
import { mergeClassnames } from '@/components/private/utils';

export const getButtonCommonStyles = ({
  disabled,
}: Pick<ButtonSettingsProps, 'disabled'>): string =>
  mergeClassnames(
    'relative z-0 flex justify-center items-center font-medium no-underline overflow-hidden py-3 rounded-full',
    'whitespace-nowrap select-none transition duration-200 text-base leading-tight',
    disabled ? 'cursor-not-allowed' : 'active:scale-90',
    !disabled && 'focus:shadow-[0_0_0_2px] transition-colors ease-out',
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
          !disabled && 'hover:bg-red-10',
        )
      : mergeClassnames(
          'text-primary-50 bg-transparent border border-[#C2C6CF]',
          'disabled:border-neutral-90 disabled:text-neutral-70',
          !disabled
          && 'hover:bg-primary-98 focus:border focus:border-[#C2C6CF] focus:shadow-primary-60',
        );
  }
  if (variant === 'tertiary') {
    return animation === 'error'
      ? 'text-goten bg-chichi'
      : 'text-primary-50 hover:bg-primary-98';
  }
  if (variant === 'ghost') {
    return animation === 'error'
      ? mergeClassnames(
          'text-red-50 bg-transparent',
          !disabled && 'hover:bg-red-10',
        )
      : mergeClassnames(
          'text-primary-50 bg-transparent',
          disabled && 'text-neutral-70',
          !disabled
          && 'hover:bg-primary-98 focus:border-2 focus:border-[#858DA0] focus:shadow-primary-60',
        );
  }
  if (variant === 'secondary') {
    return animation === 'error'
      ? mergeClassnames(
          'text-chichi bg-primary-90',
          !disabled && 'hover:bg-chichi-10',
        )
      : mergeClassnames(
          'text-primary-50 bg-primary-90',
          disabled && 'bg-neutral-90 text-neutral-70',
          !disabled
          && 'hover:bg-primary-80 focus:border focus:border-primary-80 focus:shadow-primary-60',
        );
  }
  return animation === 'error'
    ? 'text-white bg-red-50'
    : mergeClassnames(
        'text-white bg-primary-50',
        disabled && 'bg-neutral-90 text-neutral-70',
        !disabled
        && 'hover:bg-primary-80 focus:border focus:border-primary-80 focus:shadow-primary-60',
      );
};

type Props = { iconElement?: React.JSX.Element } & ButtonSettingsProps;

export const getIconHorizontalPosition = ({
  iconRight,
  iconLeft,
  size,
}: Pick<Props, 'iconRight' | 'iconLeft' | 'size'>): string => {
  if (iconRight) {
    switch (size) {
      case 'xs':
      case 'sm':
        return 'end-1';
      case 'lg':
        return 'end-3';
      case 'xl':
        return 'end-4';
      default:
        return 'end-2';
    }
  }
  if (iconLeft) {
    switch (size) {
      case 'xs':
      case 'sm':
        return 'start-1';
      case 'lg':
        return 'start-3';
      case 'xl':
        return 'start-4';
      default:
        return 'start-2';
    }
  }
  return '';
};

export const getLoaderColor = (variant?: ButtonVariants): string => {
  switch (variant) {
    case 'secondary':
    case 'outline':
      return 'border-black';
    case 'ghost':
      return 'border-neutral-50';
    default:
      return 'border-white';
  }
};
