import type { InputHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';

import { mergeClassnames } from '@/components/private/utils';

import type { TextInputTypes } from './types';
import { getSizeStyles, makeBorder } from './utils';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  inputSize?: 'sm' | 'md' | 'lg' | 'xl' | string;
  type?: TextInputTypes | string;
  label?: ReactNode;
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
const Input = forwardRef<
  HTMLInputElement,
  TextInputProps & { isLabel?: boolean; isRtl?: boolean; isPassword?: boolean }
>((props, ref) => {
  const {
    bgColor,
    inputSize = 'md',
    isError,
    type = 'text',
    placeholder = '',
    isLabel,
    isRtl,
    isSharpLeftSide,
    isSharpRightSide,
    isSharpTopSide,
    isSharpBottomSide,
    isTopBottomBorderHidden,
    isSideBorderHidden,
    isFirst,
    className,
    ...rest
  } = props;
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={mergeClassnames(
        'block w-full max-w-full py-0 px-4 m-0 appearance-none text-moon-16 text-bulma transition-shadow box-border relative z-[2]',
        'shadow-input hover:shadow-input-hov',
        'focus:shadow-input-focus focus:outline-none',
        isError &&
          'shadow-input-err hover:shadow-input-err focus:shadow-input-err',
        bgColor || 'bg-transparent',
        getSizeStyles(inputSize as string),
        'before:box-border after:box-border',
        'placeholder:text-trunks placeholder:opacity-100 placeholder:transition-opacity placeholder:delay-75',
        'read-only:outline-0 read-only:border-none read-only:cursor-not-allowed read-only:hover:shadow-input read-only:focus:shadow-input',
        type === 'number' && 'input-number-clear',
        type === 'date' && 'input-d',
        type === 'date' && isRtl && 'input-d-rtl',
        type === 'time' && 'input-t',
        type === 'time' && isRtl && 'input-t-rtl',
        type === 'datetime-local' && 'input-d',
        type === 'datetime-local' && isRtl && 'input-dt-local-rtl',
        inputSize === 'xl' && 'input-xl-dt-shared',
        inputSize === 'xl' &&
          isLabel &&
          'input-xl pt-[1.125rem] input-xl-dt-label',
        inputSize === 'lg' && 'input-lg-dt-shared',
        'input-dt-shared',
        (isSharpLeftSide || isSharpTopSide) && !isError && 'rounded-ss-none',
        (isSharpRightSide || isSharpTopSide) && !isError && 'rounded-se-none',
        (isSharpLeftSide || isSharpBottomSide) && !isError && 'rounded-es-none',
        (isSharpRightSide || isSharpBottomSide) &&
          !isError &&
          'rounded-ee-none',
        'invalid:shadow-input-err invalid:hover:shadow-input-err invalid:focus:shadow-input-err',
        makeBorder(
          isSideBorderHidden,
          isTopBottomBorderHidden,
          isFirst,
          isRtl,
          isError,
        ),
        className && className,
      )}
      {...rest}
    />
  );
});
Input.displayName = 'Input';

export default Input;
