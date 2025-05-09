import type { ReactNode } from 'react';
import type React from 'react';

type InputProps = {
  className?: string;
  children?: ReactNode;
};

type LabelProps = {
  isDisabled?: boolean;
  children?: React.ReactNode;
};

type SelectButtonProps = {
  size?: 'sm' | 'md' | 'lg' | string;
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
  size?: 'sm' | 'md' | 'lg' | string;
  isError?: boolean;
  isDisabled?: boolean;
  isUppercase?: boolean;
};

export type { InputProps, LabelProps, SelectButtonProps, SelectButtonState };
