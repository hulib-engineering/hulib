import type { allowedCharactersValues } from '@/components/core/authCode/private/utils';

type AuthCodeRef = {
  focus: () => void;
  clear: () => void;
};

type AuthCodeProps = {
  allowedCharacters?: (typeof allowedCharactersValues)[number];
  ariaLabel?: string;
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  isPassword?: boolean;
  length?: number;
  placeholder?: string;
  onChange: (res: string) => void;
  isValid?: boolean;
  size?: 'sm' | 'md';
};

type InputType = 'text' | 'tel' | 'password';

type InputMode = 'text' | 'numeric';

type InputProps = {
  type: InputType;
  inputMode: InputMode;
  pattern: string;
  min?: string;
  max?: string;
};

export type { AuthCodeProps, AuthCodeRef, InputProps };
