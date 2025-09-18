import type { MutableRefObject, ReactNode } from 'react';

type AccordionSizes = 'sm' | 'md' | 'lg' | 'xl';

type AccordionRootProps = {
  children: ReactNode | ReactNode[];
  className?: string;
  defaultValue?: string;
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

type AccordionProps = AccordionRootProps & {
  itemSize?: AccordionSizes;
  singleOpen?: boolean;
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

type ItemProps = {
  value: string;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
};

type AccordionItemState = {
  size?: AccordionSizes;
  contentElement?: MutableRefObject<HTMLDivElement | null>;
  disabled?: boolean;
};

type HeaderProps = {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

type ButtonProps = {
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
};

type ContentProps = {
  className?: string;
  children?: ReactNode;
};

export type {
  AccordionRootProps,
  AccordionProps,
  AccordionSizes,
  AccordionItemState,
  ItemProps,
  HeaderProps,
  ButtonProps,
  ContentProps,
};
