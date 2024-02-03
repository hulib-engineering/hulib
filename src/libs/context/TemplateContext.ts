import { createContext, useContext } from 'react';

type BaseTemplateState = {
  currentModalRef?: string;
};

const BaseTemplateContext = createContext<BaseTemplateState>({});
BaseTemplateContext.displayName = 'BaseTemplateContext';

const useBaseTemplateContext = (component: string) => {
  const context = useContext(BaseTemplateContext);
  if (context === null) {
    // if (Error.captureStackTrace) Error.captureStackTrace(err, useDropdownContext);
    throw new Error(
      `<${component}> is missing a parent <Dropdown /> component.`,
    );
  }
  return context;
};

export { BaseTemplateContext, useBaseTemplateContext };
