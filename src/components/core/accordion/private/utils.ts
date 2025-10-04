import { createContext, useContext } from 'react';

import type { AccordionItemState, AccordionSizes } from './types';

const AccordionContext = createContext<{ itemSize?: AccordionSizes }>({});
AccordionContext.displayName = 'AccordionContext';

const AccordionItemContext = createContext<AccordionItemState>({});
AccordionItemContext.displayName = 'AccordionItemContext';

const useAccordionContext = (component: string) => {
  const context = useContext(AccordionContext);

  if (context === null) {
    const err = new Error(
      `<${component}> is missing a parent <Accordion /> component.`,
    );
    throw err;
  }

  return context;
};

const useAccordionItemContext = (component: string) => {
  const context = useContext(AccordionItemContext);

  if (context === null) {
    const err = new Error(
      `<${component}> is missing a parent <Accordion.Item /> component.`,
    );
    throw err;
  }

  return context;
};

const getPadding = (isContentInside?: boolean, size?: AccordionSizes) => {
  if (isContentInside) {
    switch (size) {
      case 'xl':
        return 'p-4';
      case 'lg':
        return 'p-3';
      case 'sm':
        return 'p-2';
      default:
        return 'py-2 ps-3 pe-2';
    }
  }
  return '';
};

const getFont = (size?: AccordionSizes) => {
  switch (size) {
    case 'xl':
      return `text-moon-16`;
    case 'sm':
      return `text-moon-12`;
    default:
      return `text-moon-14`;
  }
};

const getMargin = (size?: AccordionSizes) => {
  switch (size) {
    case 'xl':
      return 'mt-4';
    case 'lg':
      return 'mt-3';
    default:
      return 'mt-2';
  }
};

export {
  AccordionContext,
  AccordionItemContext,
  useAccordionContext,
  useAccordionItemContext,
  getPadding,
  getFont,
  getMargin,
};
