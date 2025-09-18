import React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';

import type { AccordionRootProps } from '../private/types';

const AccordionSingle = ({
  children,
  className,
  defaultValue,
}: AccordionRootProps) => (
  <RadixAccordion.Root
    type="single"
    collapsible
    className={className}
    defaultValue={defaultValue}
  >
    {children}
  </RadixAccordion.Root>
);

export default AccordionSingle;
