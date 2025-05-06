import type {
  ButtonHTMLAttributes,
  ElementType,
  ReactElement,
  ReactNode,
} from 'react';

import type { PolymorphicComponentPropWithRef } from '@/components/private/types';

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  iconOnly?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  size?: 'sm' | 'md';
  isStroke?: boolean;
  variant?: 'default' | 'ghost';
  children?: ReactNode;
  className?: string;
};

type ChipComponentProps = <C extends ElementType = 'button'>(
  props: ChipPolymorphicProps<C>,
) => ReactElement | null;

type ChipPolymorphicProps<C extends ElementType> =
  PolymorphicComponentPropWithRef<C, ChipProps>;

export type { ChipComponentProps, ChipPolymorphicProps, ChipProps };
