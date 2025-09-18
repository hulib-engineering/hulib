import React, { useMemo, useRef } from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';

import AccordionSingle from './styles/AccordionSingle';
import AccordionMultiple from './styles/AccordionMultiple';
import {
  AccordionContext,
  AccordionItemContext,
  getFont,
  getMargin,
  getPadding,
  useAccordionContext,
  useAccordionItemContext,
} from './private/utils';
import type { AccordionProps, ButtonProps, ContentProps, HeaderProps, ItemProps } from './private/types';

import { mergeClassnames } from '@/components/private/utils';

const AccordionRoot = ({
  children,
  itemSize = 'md',
  className,
  singleOpen = false,
  defaultValue,
  value,
  onValueChange,
}: AccordionProps) => {
  const values = useMemo(
    () => ({ itemSize }),
    [itemSize],
  );

  const RadixAccordionRoot = singleOpen ? AccordionSingle : AccordionMultiple;

  return (
    <RadixAccordionRoot
      className={mergeClassnames('flex w-full gap-2 flex-col', className)}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      <AccordionContext.Provider value={values}>
        {children}
      </AccordionContext.Provider>
    </RadixAccordionRoot>
  );
};

const Item = ({ children, value, className, disabled }: ItemProps) => {
  const { itemSize } = useAccordionContext('Accordion.Item');

  const contentElement = useRef<HTMLDivElement>(null);

  const values = useMemo(
    () => ({ size: itemSize, contentElement, disabled }),
    [disabled, itemSize],
  );

  return (
    <RadixAccordion.Item
      value={value}
      className={mergeClassnames('w-full', className)}
      key={value}
      disabled={disabled}
    >
      <AccordionItemContext.Provider value={values}>
        {children}
      </AccordionItemContext.Provider>
    </RadixAccordion.Item>
  );
};

const Header = ({ children, className }: HeaderProps) => (
  <RadixAccordion.Header
    className={mergeClassnames(
      'w-full rounded-moon-s-sm bg-goku hulib-open:rounded-b-none',
      className,
    )}
  >
    {children}
  </RadixAccordion.Header>
);

const Button = ({ children, className }: ButtonProps) => {
  const { size, disabled } = useAccordionItemContext('Accordion.Button');

  return (
    <RadixAccordion.Trigger
      disabled={disabled}
      className={mergeClassnames(
        getPadding(true, size),
        getFont(size),
        'w-full justify-between flex items-center relative gap-1 cursor-pointer flex-1 font-medium',
        'text-bulma text-start data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
        className,
      )}
    >
      {children}
    </RadixAccordion.Trigger>
  );
};

const Content = ({ children, className }: ContentProps) => {
  const { contentElement } = useAccordionItemContext('Accordion.Content');

  return (
    <RadixAccordion.Content
      className={mergeClassnames(
        'hulib-open:flex bg-goku rounded-moon-s-sm rounded-t-none p-2 border-t border-beerus',
        'text-moon-14 w-full text-bulma',
        className,
      )}
      ref={contentElement}
    >
      {children}
    </RadixAccordion.Content>
  );
};

const ContentOutside = ({ children, className }: ContentProps) => {
  const { size } = useAccordionItemContext('Accordion.ContentOutside');
  return (
    <RadixAccordion.Content
      className={mergeClassnames(
        getMargin(size),
        'hulib-open:flex w-full text-bulma text-moon-14',
        className,
      )}
    >
      {children}
    </RadixAccordion.Content>
  );
};

const Accordion = Object.assign(AccordionRoot, {
  Item,
  Header,
  Button,
  Content,
  ContentOutside,
});

export default Accordion;
