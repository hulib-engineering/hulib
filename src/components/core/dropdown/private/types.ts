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
import type React from 'react';

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

type DropdownRootProps = {
  value: unknown;
  onChange: (value: unknown) => void;
  onClear?: () => void;
  isError?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | string;
  className?: string;
  multiple?: boolean;
  position?: Placement;
  children?: ReactNode | ((data: { open?: boolean }) => ReactNode);
  ref?: Ref<HTMLElement>;
} & Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
    'children' | 'ref'
>;

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

type SelectProps = {
  label?: React.JSX.Element | string;
  placeholder?: React.JSX.Element | string;
  open?: boolean;
  value?: undefined;
  innerLabel?: boolean;
  className?: string;
};

export type {
  DropdownRootProps,
  DropdownState,
  OptionProps,
  OptionsProps,
  SelectProps,
};
