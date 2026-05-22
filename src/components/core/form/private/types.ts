import type {
  DetailedHTMLProps,
  FormHTMLAttributes,
  ReactNode,
} from 'react';
import type {
  ControllerProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';

type FormProps = {
  size?: Size;
  className?: string;
  onSubmit?: (event: React.FormEvent) => void;
  form?: UseFormReturn<any>;
} & Omit<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'size'
>;

type FormState = {
  size?: Size;
};

type ItemProps = {
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

type Size = 'sm' | 'md' | 'lg';

type LabelProps = {
  children?: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
};

export type {
  FormProps,
  FormState,
  ItemProps,
};

export type { LabelProps };

export type { ControllerProps, FieldPath, FieldValues };
