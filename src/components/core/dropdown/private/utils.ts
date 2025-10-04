import { createContext, useContext } from 'react';

import type { DropdownState } from '@/components/core/dropdown/private/types';

const DropdownContext = createContext<DropdownState>({});
DropdownContext.displayName = 'DropdownContext';

const useDropdownContext = (component: string) => {
  const context = useContext(DropdownContext);
  if (context === null) {
    // if (Error.captureStackTrace) Error.captureStackTrace(err, useDropdownContext);
    throw new Error(
      `<${component}> is missing a parent <Dropdown /> component.`,
    );
  }
  return context;
};

export { DropdownContext, useDropdownContext };
