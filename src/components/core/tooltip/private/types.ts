import type {
  Content as RadixContent,
  Root as RadixRoot,
  Trigger as RadixTrigger,
} from '@radix-ui/react-tooltip';
import type { ComponentProps } from 'react';

import type { WithChildren } from '@/components/core/private/types';

export type Align = 'start' | 'center' | 'end' | undefined;

export type Side = 'top' | 'right' | 'bottom' | 'left';

export type ArrowProps = {
  className?: string;
};

type Position =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end'
  | 'right'
  | 'left';

export type ContentProps = {
  position?: Position;
  className?: string;
  children?: React.ReactNode;
  container?: HTMLElement | null;
};

export type ContentComponentProps = ContentProps &
  ComponentProps<typeof RadixContent>;

export type RootContentProps = WithChildren<ComponentProps<typeof RadixRoot>>;

type TriggerProps = {
  className?: string;
};

export type TriggerComponentProps = WithChildren<TriggerProps> &
  ComponentProps<typeof RadixTrigger>;

export type TooltipState = {
  withArrow?: boolean;
  registerChild?: (child: string) => () => void;
};
