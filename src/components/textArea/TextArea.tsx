import React, { forwardRef } from 'react';

import { useFormContext, useFormItemContext } from '../form/private/utils';
import type { TextAreaProps } from './private/types';
import { getSizeStyles } from './private/utils';
import { mergeClassnames } from '@/components/private/utils';

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      size: inputSize,
      error: inputError,
      disabled: inputDisabled,
      id,
      rows = 3,
      ...rest
    },
    ref,
  ) => {
    const { size: formSize } = useFormContext('TextArea');
    const {
      size: formItemSize,
      disabled: formItemDisabled,
      error: formItemError,
    } = useFormItemContext('TextArea');
    const size = inputSize || formItemSize || formSize;
    const disabled = inputDisabled || formItemDisabled;
    const error = inputError || formItemError;

    return (
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        disabled={disabled}
        className={mergeClassnames(
          'block w-full max-w-full p-3 m-0 appearance-none text-neutral-10',
          'transition-all ease-out box-border rounded-2xl border border-neutral-90 relative z-[2] bg-neutral-98 shadow-input active:input-active',
          'hover:shadow-input-hov hover:input-hov',
          'focus:input-focus focus:outline-none focus-visible:input-focus focus-visible:outline-none',
          'before:box-border after:box-border placeholder:delay-75',
          'placeholder:text-neutral-40 placeholder:opacity-100 placeholder:transition-opacity',
          'read-only:bg-neutral-90 read-only:outline-0 read-only:input-def read-only:cursor-not-allowed',
          'read-only:hover:shadow-input read-only:focus:shadow-input',
          'read-only:focus-visible:shadow-input invalid:focus-visible:shadow-input-err',
          'invalid:shadow-input-err invalid:hover:shadow-input-err invalid:focus:shadow-input-err invalid:input-err',
          getSizeStyles(size),
          error
          && 'input-err text-red-50 hover:input-err focus:input-err focus-visible:input-err',
          disabled && 'bg-neutral-90 text-neutral-40 opacity-60 cursor-not-allowed',
          className,
        )}
        {...rest}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
