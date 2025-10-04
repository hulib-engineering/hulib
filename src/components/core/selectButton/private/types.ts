import type { ReactNode } from 'react';
import type React from 'react';

type InputProps = {
  className?: string;
  children?: ReactNode;
};

type LabelProps = {
  labelSize?: 'sm' | 'md' | 'lg' | 'xl' | string; // deprecated
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

export type { ChipProps, InputProps, LabelProps, SelectButtonProps, SelectButtonState };
