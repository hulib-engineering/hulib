import type { ReactNode } from 'react';

type OptionProps = {
  value?: string | number;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
};

type RadioProps = {
  defaultValue?: string | number;
  value?: string | number;
  onChange?: (value: unknown) => void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  name?: string;
};

export type { OptionProps, RadioProps };
