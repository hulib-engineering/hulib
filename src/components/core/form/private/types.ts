import type { DetailedHTMLProps, FormHTMLAttributes, ReactNode } from 'react';

type FormProps = {
  size?: Size;
  className?: string;
  onSubmit?: (event: React.FormEvent) => void;
} & Omit<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'size'
>;

type FormState = {
  size?: Size;
};

type ItemProps = {
  size?: Size;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  children?: ReactNode;
};

type ItemState = {
  size?: Size;
  disabled?: boolean;
  error?: boolean;
};

type Size = 'sm' | 'md' | 'lg';

export type { FormProps, FormState, ItemProps, ItemState };

export type LabelProps = {
  children?: React.ReactNode;
  required?: boolean;
};
