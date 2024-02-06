import { createContext, useContext } from 'react';

import type { FormState, ItemState } from './types';

const ItemContext = createContext<ItemState>({});
ItemContext.displayName = 'ItemContext';

const useFormItemContext = (component: string) => {
  const context = useContext(ItemContext);
  if (context === null) {
    // if (Error.captureStackTrace) Error.captureStackTrace(err, useMenuItemContext);
    throw new Error(`<${component}> is missing root <Form.Item /> component.`);
  }
  return context;
};

const FormContext = createContext<FormState>({});
FormContext.displayName = 'FormContext';

const useFormContext = (component: string) => {
  const context = useContext(FormContext);
  if (context === null) {
    // if (Error.captureStackTrace) Error.captureStackTrace(err, useMenuItemContext);
    throw new Error(`<${component}> is missing root <Form /> component.`);
  }
  return context;
};

export { FormContext, ItemContext, useFormContext, useFormItemContext };
