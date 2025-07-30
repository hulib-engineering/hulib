import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';

type InputProps = {
  className?: string;
  type?: HTMLInputTypeAttribute;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  isRtl?: boolean;
  disabled?: boolean;
  id?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export default InputProps;
