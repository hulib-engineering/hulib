import { createContext, useContext } from 'react';

import type { SelectButtonState } from './types';

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

export { SelectButtonContext, useSelectButtonContext };
