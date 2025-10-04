import { createContext, useContext } from 'react';

import type { SelectButtonState } from './types';

const getSelectSize = (size?: 'sm' | 'md' | 'lg' | string) => {
  switch (size) {
    case 'lg':
      return 'h-12 p-3 rounded-moon-i-sm';
    case 'sm':
      return 'h-8 py-1 px-2 rounded-moon-i-xs';
    case 'md':
    default:
      return 'h-10 py-2 px-3 rounded-moon-i-sm';
  }
};

const SelectButtonContext = createContext<SelectButtonState>({});
SelectButtonContext.displayName = 'InputBtnContext';

const useSelectButtonContext = (component: string) => {
  const context = useContext(SelectButtonContext);
  if (context === null) {
    throw new Error(
      `<${component}> is missing a parent <SelectButton /> component.`,
    );
  }
  return context;
};

export { getSelectSize, SelectButtonContext, useSelectButtonContext };
