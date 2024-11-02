import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  type?: HTMLInputTypeAttribute;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  isRtl?: boolean;
  disabled?: boolean;
  id?: string;
}

export default InputProps;
