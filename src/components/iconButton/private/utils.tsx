import { Check } from '@phosphor-icons/react';
import React from 'react';

import type {
  ButtonAnimations,
  ButtonSettingsProps,
  ButtonSizes,
} from '@/components/button/private/types';
import {
  getIconSize,
  getLoaderSize,
} from '@/components/button/private/utils/getButtonSizes';
import { getLoaderColor } from '@/components/button/private/utils/getButtonStyles';
import type { IconButtonSettingsProps } from '@/components/iconButton/private/types';
import Loader from '@/components/loader/Loader';
import { mergeClassnames } from '@/components/private/utils';

const AnimationContent = ({
  children,
  icon,
  animation,
  size,
  variant,
}: IconButtonSettingsProps) => (
  <span className="pointer-events-none relative block h-full">
    <span className="absolute left-1/2 top-1/2 flex content-center justify-center -translate-x-1/2 -translate-y-1/2">
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

const getButtonSize = (size?: ButtonSizes): string => {
  if (size === 'sm') {
    return 'h-8 p-1 gap-1 text-moon-14 rounded-moon-i-sm';
  }
  if (size === 'lg') {
    return 'h-12 p-3 gap-2 text-moon-16 rounded-moon-i-sm';
  }
  return 'h-10 p-[10px] gap-2 text-moon-14 rounded-xl';
};

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
    return animation === 'error'
      ? 'text-goten bg-chichi'
      : 'text-primary-50 hover:bg-primary-98';
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

const getAriaLabel = ({ ariaLabel, animation }: Props): string | undefined =>
  ariaLabel ||
  (animation === 'error'
    ? 'Error'
    : animation === 'progress' || animation === 'success'
      ? undefined
      : 'IconButton');

export { AnimationContent, getAriaLabel, getButtonSize };
