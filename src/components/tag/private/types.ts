import type { ReactElement, ReactNode } from 'react';

type TagProps = {
  iconLeft?: ReactElement;
  iconRight?: ReactElement;
  size?: '2xs' | 'xs';
  isUppercase?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
};

export type { TagProps };
