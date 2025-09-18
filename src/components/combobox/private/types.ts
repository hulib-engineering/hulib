import type {
  CSSProperties,
  DetailedHTMLProps,
  Dispatch,
  FocusEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  MutableRefObject,
  ReactElement,
  ReactNode,
  SetStateAction,
} from 'react';
import type React from 'react';

type InputValue<T = unknown> = T;

type Size = 'sm' | 'md' | 'lg' | 'xl';

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

type ComboboxRootProps = {
  value?: InputValue;
  displayValue?: (value: InputValue) => string;
  onChange: (value: unknown) => void;
  onQueryChange: (value: string) => void;
  onClear?: (index?: number | string) => void;
  isError?: boolean;
  disabled?: boolean;
  size?: Size;
  className?: string;
  multiple?: boolean;
  nullable?: boolean;
  position?: Placement;
  children?: ReactNode | ((data: { open?: boolean }) => ReactNode);
  placeholder?: string;
  ref?: React.Ref<HTMLElement>;
} & Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
    'children' | 'ref'
>;

type SelectProps = {
  label?: string;
  placeholder?: string;
  open?: boolean;
  value?: unknown;
  innerLabel?: boolean;
  className?: string;
  multiple?: boolean;
  counter?: number;
  onClose?: (value: unknown) => void;
};

type InputProps = {
  value?: string;
  displayValue?: (value: InputValue & { label: string }) => string;
  label?: string;
  placeholder?: string;
  open?: boolean;
  className?: string;
  type?: string;
  disabled?: boolean;
  isError?: boolean;
  ['aria-label']?: string;
  preventButtonForceClick?: boolean;
};

type ButtonProps = {
  label?: React.JSX.Element | string;
  open?: boolean;
  value?: undefined;
  className?: string;
  ['aria-label']?: string;
};

type OptionsProps = {
  menuWidth?: string;
  className?: string;
  open?: boolean;
};

type OptionProps = {
  value?: InputValue;
  children:
    | ReactElement
    | ((data: {
      selected?: boolean;
      disabled?: boolean;
      active?: boolean;
    }) => ReactElement);
};

type ComboboxState = {
  value?: InputValue;
  isError?: boolean;
  disabled?: boolean;
  onClear?: (index?: number | string) => void;
  onQueryChange?: (value: string) => void;
  displayValue?: (value: InputValue) => string;
  input?: {
    isFocused?: boolean;
    setIsFocused: Dispatch<SetStateAction<boolean>>;
  };
  popper?: {
    forceUpdate: (() => void) | null;
    styles?: { [key: string]: CSSProperties };
    attributes?: { [key: string]: { [key: string]: string } | undefined };
    setAnchor: Dispatch<SetStateAction<Element | null | undefined>>;
    setPopper: Dispatch<SetStateAction<HTMLElement | null | undefined>
    >;
  };
  size?: Size;
  comboboxButtonRef?: MutableRefObject<HTMLButtonElement | null>;
  handleOnFocus?: (
    e: React.FocusEvent<HTMLInputElement>,
    shouldForceClick?: boolean,
  ) => void;
  handleOnBlur?: FocusEventHandler<HTMLInputElement>;
  handleOnKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

export type {
  ButtonProps,
  ComboboxRootProps,
  ComboboxState,
  InputProps,
  OptionProps,
  OptionsProps,
  SelectProps,
  Size,
};
