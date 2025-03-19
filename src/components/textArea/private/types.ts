import type { TextareaHTMLAttributes } from 'react';

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  isRtl?: boolean;
  disabled?: boolean;
  id?: string;
}
