import type { ElementType, ReactNode } from 'react';
import type React from 'react';

import type {
  ButtonAnimations,
  ButtonSizes,
  ButtonVariants,
} from '@/components/core/button/private/types';

export type IconButtonSettingsProps = {
  icon?: React.JSX.Element;
  children?: ReactNode;
  size?: ButtonSizes;
  animation?: ButtonAnimations;
  disabled?: boolean;
  variant?: ButtonVariants;
};

type IconButtonProps<C extends ElementType> = {
  as?: C;
  className?: string;
} & IconButtonSettingsProps;

export type { IconButtonProps };
