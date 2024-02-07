import type { ElementType, ReactNode } from 'react';
import type React from 'react';

export type ButtonAnimations =
  | 'progress'
  | 'success'
  | 'error'
  | 'pulse'
  | boolean;

type ButtonIcons = 'left' | 'right' | 'only';

export type ButtonSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariants =
  | 'fill'
  | 'outline'
  | 'ghost'
  | 'primary'
  | 'secondary'
  | 'tertiary';

export type ButtonSettingsProps = {
  icon?: ButtonIcons; // deprecated
  children?: ReactNode;
  size?: ButtonSizes;
  iconLeft?: React.JSX.Element | boolean;
  iconRight?: React.JSX.Element | boolean;
  iconOnly?: React.JSX.Element | boolean; // deprecated
  animation?: ButtonAnimations;
  disabled?: boolean;
  variant?: ButtonVariants;
  fullWidth?: boolean;
};

export type ButtonProps<C extends ElementType> = {
  as?: C;
  fullWidth?: boolean;
  customClassName?: string;
} & ButtonSettingsProps;

// type PolymorphicComponentProp<C extends ElementType, Props = {}> = {};
