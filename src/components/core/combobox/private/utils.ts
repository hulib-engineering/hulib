import { createContext, useContext } from 'react';

import type { ComboboxState } from './types';

import { mergeClassnames } from '@/components/core/private/utils';

const ComboboxContext = createContext<ComboboxState>({});
ComboboxContext.displayName = 'ComboboxContext';

const useComboboxContext = (component: string) => {
  const context = useContext(ComboboxContext);

  if (context === null) {
    const err = new Error(
      `<${component}> is missing a parent <Combobox /> component.`,
    );
    throw err;
  }

  return context;
};

const getSizeStyles = (size?: string, innerLabel?: boolean) => {
  const isLabel = innerLabel !== undefined && innerLabel;

  return mergeClassnames(
    size === 'sm' && 'py-1.5 px-2 rounded-moon-i-xs',
    (size === 'sm' || isLabel) && 'py-2 px-3 rounded-moon-i-xs gap-x-3',
    size === 'lg' && 'py-0.5 px-3 rounded-2xl',
    (size === 'xl' || isLabel) && 'py-3 px-4 rounded-moon-i-sm gap-x-4',
  );
};

export { getSizeStyles, useComboboxContext, ComboboxContext };
