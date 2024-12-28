import type { InputHTMLAttributes } from 'react';
import type React from 'react';

type TextInputTypes =
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url';

export default interface TextInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  inputSize?: 'sm' | 'md' | 'lg' | 'xl' | string;
  type?: TextInputTypes | string;
  label?: React.JSX.Element | string;
  placeholder?: string;
  hintText?: React.JSX.Element | string;
  isError?: boolean;
  dir?: 'ltr' | 'rtl' | 'auto';
  showPasswordText?: React.JSX.Element | string;
  bgColor?: string;
  isSharpLeftSide?: boolean;
  isSharpRightSide?: boolean;
  isSharpTopSide?: boolean;
  isSharpBottomSide?: boolean;
  isTopBottomBorderHidden?: boolean;
  isSideBorderHidden?: boolean;
  isFirst?: boolean;
}
