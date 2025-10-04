import { createContext, useContext } from 'react';

import type { Align, ContentProps, Side, TooltipState } from './types';

const TooltipContext = createContext<TooltipState>({});
TooltipContext.displayName = 'TooltipContext';

export { TooltipContext };

export const useTooltipContext = (component: string) => {
  const context = useContext(TooltipContext);
  if (context === null) {
    const err = new Error(
      `<${component}> is missing a parent <Tooltip /> component.`,
    );
    // if (Error.captureStackTrace) Error.captureStackTrace(err, useTooltipContext);
    throw err;
  }
  return context;
};

export const getAlign = (position: ContentProps['position']): Align => {
  switch (position) {
    case 'top-start':
      return 'start';
    case 'top-end':
      return 'end';
    case 'bottom-start':
      return 'start';
    case 'bottom-center':
      return 'center';
    case 'bottom-end':
      return 'end';
    case 'left':
      return undefined;
    case 'right':
      return undefined;
    default:
      return 'center';
  }
};

export const getSide = (position: ContentProps['position']): Side => {
  switch (position) {
    case 'top-start':
      return 'top';
    case 'top-end':
      return 'top';
    case 'bottom-start':
      return 'bottom';
    case 'bottom-center':
      return 'bottom';
    case 'bottom-end':
      return 'bottom';
    case 'left':
      return 'left';
    case 'right':
      return 'right';
    default:
      return 'top';
  }
};
