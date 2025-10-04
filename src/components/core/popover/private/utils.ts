import { createContext, useContext } from 'react';

import type { PopoverState } from './type';

const PopoverContext = createContext<PopoverState>({});
PopoverContext.displayName = 'PopoverContext';

const usePopoverContext = (component: string) => {
  const context = useContext(PopoverContext);

  if (context === null) {
    throw new Error(
      `<${component}> is missing a parent <Popover /> component.`,
    );
  }
  return context;
};

export { PopoverContext, usePopoverContext };
