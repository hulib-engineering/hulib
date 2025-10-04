import * as RadixTooltip from '@radix-ui/react-tooltip';
import React, { useEffect, useMemo } from 'react';

import type {
  ArrowProps,
  ContentComponentProps,
  RootContentProps,
  TriggerComponentProps,
} from './private/types';
import {
  TooltipContext,
  getAlign,
  getSide,
  useTooltipContext,
} from './private/utils';
import { mergeClassnames, useRegisterChild } from '@/components/core/private/utils';

const TooltipRoot = ({ children, ...rest }: RootContentProps) => (
  <RadixTooltip.Provider delayDuration={100}>
    <RadixTooltip.Root {...rest}>{children}</RadixTooltip.Root>
  </RadixTooltip.Provider>
);

const Arrow = ({ className }: ArrowProps) => {
  const { registerChild } = useTooltipContext('Tooltip.Arrow');

  useEffect(() => {
    if (registerChild) {
      registerChild('Arrow');
    }
  }, []);

  return (
    <RadixTooltip.Arrow asChild>
      <div
        className={mergeClassnames(
          'relative top-[-7px] rotate-45 w-3 h-3 rounded-sm bg-white',
          className,
        )}
      />
    </RadixTooltip.Arrow>
  );
};

const Trigger = ({ className, children, ...rest }: TriggerComponentProps) => (
  <RadixTooltip.Trigger asChild className={className} {...rest}>
    {children}
  </RadixTooltip.Trigger>
);

const Content = ({
  position = 'top-center',
  className,
  children,
  container,
  ...rest
}: ContentComponentProps) => {
  const states = {
    withArrow: false,
  };

  const { items, register } = useRegisterChild();

  const isArrow = items?.find(name => name === 'Arrow');

  const value = useMemo(
    () => ({ ...states, ...items, register }),
    [states.withArrow, items, register],
  );

  return (
    <TooltipContext.Provider value={value}>
      <RadixTooltip.Portal container={container}>
        <RadixTooltip.Content
          side={getSide(position)}
          align={getAlign(position)}
          sideOffset={isArrow ? 2 : 4}
          className={mergeClassnames(
            'p-3 rounded-md text-xs text-black bg-white',
            'shadow-[0_6px_6px_-6px_rgba(0,0,0,0.16)] drop-shadow-[0_0_1px_rgba(0,0,0,0.4)]',
            className,
          )}
          {...rest}
        >
          {children}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </TooltipContext.Provider>
  );
};

const Tooltip = Object.assign(TooltipRoot, { Trigger, Content, Arrow });

export default Tooltip;
