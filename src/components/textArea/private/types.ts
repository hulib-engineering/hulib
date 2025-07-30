import type { TextareaHTMLAttributes } from 'react';

export type TextAreaProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  isRtl?: boolean;
  disabled?: boolean;
  id?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>;
