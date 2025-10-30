import type { HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from 'react';

type InsetInputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  error?: boolean;
  type?: Exclude<HTMLInputTypeAttribute, 'file'>;
  isRtl?: boolean; // not in use
  isLabel?: boolean; // not in use
};

type InsetInputState = {
  registerChild?: (child: string) => () => void;
};

type LabelProps = { className?: string; children?: ReactNode };

export type { InsetInputProps, InsetInputState, LabelProps };
