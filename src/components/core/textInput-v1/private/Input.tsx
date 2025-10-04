import React, { forwardRef } from 'react';

import type TextInputProps from './types';
import { getSizeStyles, makeBorder } from './utils';
import { mergeClassnames } from '@/components/core/private/utils';

const Input = forwardRef<
  HTMLInputElement,
  TextInputProps & { isLabel?: boolean; isRtl?: boolean }
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
        'block w-full max-w-full py-0.5 px-3 m-0 appearance-none text-sm text-neutral-10 transition-shadow box-border relative z-[2]',
        'input-def hover:input-hov',
        'focus:input-focus focus:outline-none',
        isError && 'input-err hover:input-err focus:input-err',
        bgColor || 'bg-neutral-98',
        getSizeStyles(inputSize as string),
        'before:box-border after:box-border',
        'placeholder:text-neutral-40 placeholder:opacity-100 placeholder:transition-opacity placeholder:delay-75',
        'read-only:bg-neutral-90 read-only:text-neutral-40 read-only:border-none read-only:cursor-not-allowed read-only:hover:input-def read-only:focus:input-def',
        type === 'number' && 'input-number-clear',
        type === 'date' && 'input-d',
        type === 'date' && isRtl && 'input-d-rtl',
        type === 'time' && 'input-t',
        type === 'time' && isRtl && 'input-t-rtl',
        type === 'datetime-local' && 'input-d',
        type === 'datetime-local' && isRtl && 'input-dt-local-rtl',
        inputSize === 'xl' && 'input-xl-dt-shared',
        inputSize === 'xl'
        && isLabel
        && 'input-xl pt-[1.125rem] input-xl-dt-label',
        inputSize === 'lg' && 'input-lg-dt-shared',
        'input-dt-shared',
        (isSharpLeftSide || isSharpTopSide) && !isError && 'rounded-ss-none',
        (isSharpRightSide || isSharpTopSide) && !isError && 'rounded-se-none',
        (isSharpLeftSide || isSharpBottomSide) && !isError && 'rounded-es-none',
        (isSharpRightSide || isSharpBottomSide)
        && !isError
        && 'rounded-ee-none',
        'invalid:input-err invalid:hover:input-err invalid:focus:input-err',
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
