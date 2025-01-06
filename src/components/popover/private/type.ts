import type {
  CSSProperties,
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  MutableRefObject,
  ReactNode,
  SetStateAction,
} from 'react';

type Placement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end'
  | 'top'
  | 'bottom'
  | 'right'
  | 'left';

interface PopoverRootProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'children'
  > {
  position?: Placement;
  autoPositionDisable?: boolean;
  className?: string;
  children?: ReactNode | ((data: { open?: boolean }) => ReactNode);
}

type CallableChildren = (data: {
  open?: boolean;
  close?: (
    focusableElement?:
      | HTMLElement
      | MutableRefObject<HTMLElement | null>
      | undefined,
  ) => void;
}) => ReactNode;

type PopoverState = {
  popper?: {
    styles?: { [key: string]: CSSProperties };
    attributes?: { [key: string]: { [key: string]: string } | undefined };
    setAnchor: Dispatch<SetStateAction<Element | null | undefined>>;
    setPopper: Dispatch<SetStateAction<HTMLElement | null | undefined>>;
    setArrow: Dispatch<SetStateAction<HTMLElement | null>>;
  };
  register?: (child: string) => () => void;
  items?: string[];
};

interface PanelProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'children'
  > {
  className?: string;
  isStatic?: boolean;
  children?:
    | ReactNode
    | ((data: { open?: boolean; close: () => void }) => ReactNode);
}

type GroupProps = {
  className?: string;
  children: ReactNode;
};

export type {
  CallableChildren,
  GroupProps,
  PanelProps,
  PopoverRootProps,
  PopoverState,
};
