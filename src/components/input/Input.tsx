import React, { forwardRef } from 'react';

import { mergeClassnames } from '@/components/private/utils';

import { useFormContext, useFormItemContext } from '../form/private/utils';
import type InputProps from './private/types';
import { getMaxDate, getSizeStyles, getTypeStyles } from './private/utils';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size: inputSize,
      error: inputError,
      disabled: inputDisabled,
      id,
      ...rest
    },
    ref,
  ) => {
    const { size: formSize } = useFormContext('Input');
    const {
      size: formItemSize,
      disabled: formItemDisabled,
      error: formItemError,
    } = useFormItemContext('Input');
    const size = inputSize || formItemSize || formSize;
    const disabled = inputDisabled || formItemDisabled;
    const error = inputError || formItemError;

    if (type === 'checkbox') {
      return (
        <input
          ref={ref}
          type="checkbox"
          id={id}
          disabled={disabled}
          className={mergeClassnames(
            'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ring-offset-1 focus:ring-2 inline-block',
            disabled && 'opacity-60 cursor-not-allowed',
            className,
          )}
          {...rest}
        />
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        id={id}
        disabled={disabled}
        max={getMaxDate(type)}
        className={mergeClassnames(
          'block w-full max-w-full p-3 m-0 appearance-none text-bulma',
          'transition-shadow box-border rounded-2xl border border-solid border-neutral-90 relative z-[2] bg-neutral-98 shadow-input hover:shadow-input-hov',
          'focus:shadow-input-focus focus:outline-none focus-visible:shadow-input-focus',
          'focus-visible:outline-none before:box-border after:box-border placeholder:delay-75',
          'placeholder:text-neutral-40 placeholder:opacity-100 placeholder:transition-opacity',
          'read-only:outline-0 read-only:border-none read-only:cursor-not-allowed',
          'read-only:hover:shadow-input read-only:focus:shadow-input',
          'read-only:focus-visible:shadow-input invalid:focus-visible:shadow-input-err',
          'invalid:shadow-input-err invalid:hover:shadow-input-err invalid:focus:shadow-input-err',
          getSizeStyles(size),
          getTypeStyles(type),
          error &&
            'input-err hover:input-err focus:input-err focus-visible:input-err',
          disabled && 'opacity-60 cursor-not-allowed',
          className,
        )}
        {...rest}
      />
    );
  },
);
Input.displayName = 'Input';

export default Input;
