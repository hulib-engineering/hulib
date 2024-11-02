import type { DetailedHTMLProps, FormHTMLAttributes, ReactNode } from 'react';

interface FormProps
  extends Omit<
    DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
    'size'
  > {
  size?: Size;
  className?: string;
  onSubmit?: () => void;
}

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
