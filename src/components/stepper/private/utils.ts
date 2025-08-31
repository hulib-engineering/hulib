import { createContext, useContext } from 'react';

import type { StepperContextType } from './types';

const StepperContext = createContext<StepperContextType | null>(null);

const useStepperContext = (component: string) => {
  const context = useContext(StepperContext);
  if (context === null) {
    // if (Error.captureStackTrace) Error.captureStackTrace(err, useDropdownContext);
    throw new Error(
      `<${component}> is missing a parent <Dropdown /> component.`,
    );
  }
  return context;
};

export { StepperContext, useStepperContext };
