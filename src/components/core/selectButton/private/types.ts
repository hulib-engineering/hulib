import type { ReactNode } from 'react';
import type React from 'react';

type InputProps = {
  className?: string;
  children?: ReactNode;
};

type LabelProps = {
  isDisabled?: boolean;
  children?: ReactNode;
  htmlFor?: string;
};

type ChipProps = {
  children: ReactNode;
  onClear?: () => void;
  isUppercase?: boolean;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
};

type SelectButtonProps = {
  isError?: boolean;
  open?: boolean;
  isDisabled?: boolean;
  label?: React.JSX.Element | string;
  placeholder?: React.JSX.Element | string;
  children?: ReactNode;
  isUppercase?: boolean;
};

type SelectButtonState = {
  open?: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  isUppercase?: boolean;
};

export type { ChipProps, InputProps, LabelProps, SelectButtonProps, SelectButtonState };
