import { createContext, useContext } from 'react';

import type { MenuItemState } from './types';

const MenuItemContext = createContext<MenuItemState>({});
MenuItemContext.displayName = 'MenuItemContext';

const useMenuItemContext = (component: string) => {
  const context = useContext(MenuItemContext);
  if (context === null) {
    const err = new Error(
      `<${component}> is missing a parent <Menu /> component.`,
    );
    // if (Error.captureStackTrace) Error.captureStackTrace(err, useMenuItemContext);
    throw err;
  }
  return context;
};

export { MenuItemContext, useMenuItemContext };
