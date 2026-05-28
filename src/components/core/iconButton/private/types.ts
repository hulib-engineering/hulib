import type { ElementType, ReactNode } from 'react';
import type React from 'react';

import type {
  ButtonAnimations,
  ButtonVariants,
} from '@/components/core/button/private/types';

type IconButtonSizes = 'sm' | 'md' | 'lg';

export type IconButtonSettingsProps = {
  icon?: React.JSX.Element;
  children?: ReactNode;
  size?: IconButtonSizes;
  animation?: ButtonAnimations;
  disabled?: boolean;
  variant?: ButtonVariants;
};

type IconButtonProps<C extends ElementType> = {
  as?: C;
  className?: string;
} & IconButtonSettingsProps;

export type { IconButtonProps, IconButtonSizes };
