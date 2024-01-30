import type {
  CSSProperties,
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
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

interface DropdownRootProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
    'children' | 'ref'
  > {
  value: unknown;
  onChange(value: unknown): void;
  onClear?: () => void;
  isError?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | string;
  className?: string;
  multiple?: boolean;
  position?: Placement;
  children?: ReactNode | ((data: { open?: boolean }) => ReactNode);
  ref?: Ref<HTMLElement>;
}

type DropdownState = {
  value?: any;
  isError?: boolean;
  disabled?: boolean;
  onClear?: () => void;
  popper?: {
    styles?: { [key: string]: CSSProperties };
    attributes?: { [key: string]: { [key: string]: string } | undefined };
    setAnchor: Dispatch<SetStateAction<Element | null | undefined>>;
    setPopper: Dispatch<SetStateAction<HTMLElement | null | undefined>>;
  };
  size?: 'sm' | 'md' | 'lg' | string;
};

type OptionProps = {
  value?: unknown;
  children:
    | ReactElement
    | ((data: { selected?: boolean; active?: boolean }) => ReactElement);
};

type OptionsProps = {
  menuWidth?: string;
  className?: string;
};

export type { DropdownRootProps, DropdownState, OptionProps, OptionsProps };
