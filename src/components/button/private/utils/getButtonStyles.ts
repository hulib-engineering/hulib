import type React from 'react';

import { mergeClassnames } from '@/components/private/utils';

import type { ButtonSettingsProps, ButtonVariants } from '../types';

export const getButtonCommonStyles = ({
  disabled,
}: Pick<ButtonSettingsProps, 'disabled'>): string =>
  mergeClassnames(
    'relative z-0 flex justify-center items-center font-medium no-underline overflow-hidden py-3 rounded-full',
    'whitespace-nowrap select-none transition duration-200 text-base leading-normal',
    disabled ? 'opacity-60 cursor-not-allowed' : 'active:scale-90',
  );

export const getButtonVariants = ({
  variant,
  disabled,
  animation,
}: Pick<ButtonSettingsProps, 'variant' | 'disabled' | 'animation'>): string => {
  if (variant === 'secondary' || variant === 'outline') {
    return animation === 'error'
      ? mergeClassnames(
          'text-chichi bg-transparent ring-inset ring-1 ring-chichi',
          !disabled && 'hover:bg-chichi-10',
        )
      : mergeClassnames(
          'text-bulma bg-transparent ring-inset ring-1 ring-trunks',
          !disabled && 'hover:ring-bulma',
        );
  }
  if (variant === 'tertiary') {
    return animation === 'error' ? 'text-goten bg-chichi' : 'text-goten bg-hit';
  }
  if (variant === 'ghost') {
    return animation === 'error'
      ? mergeClassnames(
          'text-chichi bg-transparent',
          !disabled && 'hover:bg-chichi-10',
        )
      : mergeClassnames(
          'text-trunks bg-transparent',
          !disabled && 'hover:text-bulma',
        );
  }
  return animation === 'error'
    ? 'text-white bg-chichi'
    : 'text-white bg-primary';
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
      return 'border-bulma';
    case 'ghost':
      return 'border-trunks';
    default:
      return 'border-goten';
  }
};
