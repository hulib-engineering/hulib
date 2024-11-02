import { ChevronDownIcon } from '@heroicons/react/16/solid';
import React, { forwardRef } from 'react';

import { useFormContext, useFormItemContext } from './form/private/utils';
import type { WithChildren } from './private/types';
import { mergeClassnames } from './private/utils';

const getSizeStyles = (size?: string) => {
  switch (size) {
    case 'xl':
      return 'h-14 leading-[3.5rem] rounded-moon-i-sm rtl:[&:not([disabled])]:hover:rounded-moon-i-sm rtl:[&:not([disabled])]:focus:rounded-moon-i-sm rtl:invalid:rounded-moon-i-sm ltr:[&:not([disabled])]:hover:rounded-moon-i-sm ltr:[&:not([disabled])]:focus:rounded-moon-i-sm ltr:invalid:rounded-moon-i-sm';
    case 'lg':
      return 'h-12 leading-[3rem] rounded-moon-i-sm rtl:[&:not([disabled])]:hover:rounded-moon-i-sm rtl:[&:not([disabled])]:focus:rounded-moon-i-sm rtl:invalid:rounded-moon-i-sm ltr:[&:not([disabled])]:hover:rounded-moon-i-sm ltr:[&:not([disabled])]:focus:rounded-moon-i-sm ltr:invalid:rounded-moon-i-sm';
    case 'sm':
      return 'h-8 leading-8 rounded-moon-i-xs rtl:[&:not([disabled])]:hover:rounded-moon-i-xs rtl:[&:not([disabled])]:focus:rounded-moon-i-xs rtl:invalid:rounded-moon-i-xs ltr:[&:not([disabled])]:hover:rounded-moon-i-xs ltr:[&:not([disabled])]:focus:rounded-moon-i-xs ltr:invalid:rounded-moon-i-xs';
    default:
      return 'h-10 leading-10 rounded-moon-i-sm rtl:[&:not([disabled])]:hover:rounded-moon-i-sm rtl:[&:not([disabled])]:focus:rounded-moon-i-sm rtl:invalid:rounded-moon-i-sm ltr:[&:not([disabled])]:hover:rounded-moon-i-sm ltr:[&:not([disabled])]:focus:rounded-moon-i-sm ltr:invalid:rounded-moon-i-sm';
  }
};

export interface NativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}
const NativeSelect = forwardRef<
  HTMLSelectElement,
  WithChildren<NativeSelectProps>
>(
  (
    {
      children,
      className,
      size: selectSize,
      error: selectError,
      disabled: selectDisabled,
      readOnly,
      ...rest
    },
    ref,
  ) => {
    const { size: formSize } = useFormContext('Select');
    const {
      size: formItemSize,
      disabled: formItemDisabled,
      error: formItemError,
    } = useFormItemContext('Select');
    const size = selectSize || formItemSize || formSize;
    const disabled = selectDisabled || formItemDisabled;
    const error = selectError || formItemError;

    return (
      <span
        className={mergeClassnames(
          'block relative w-full',
          disabled && 'opacity-60 cursor-not-allowed',
          readOnly && 'cursor-not-allowed',
          className && className,
        )}
      >
        <select
          ref={ref}
          disabled={disabled || readOnly}
          className={mergeClassnames(
            'block w-full max-w-full py-0 px-4 m-0 appearance-none text-moon-16 text-bulma transition-shadow box-border relative z-[2] cursor-pointer',
            'bg-goku shadow-input hover:shadow-input-hov',
            'focus:shadow-input-focus focus:outline-none',
            error &&
              'shadow-input-err hover:shadow-input-err focus:shadow-input-err',
            'invalid:shadow-input-err invalid:hover:shadow-input-err invalid:focus:shadow-input-err',
            getSizeStyles(size as string),
            'before:box-border after:box-border',
            'placeholder:text-trunks placeholder:opacity-100 placeholder:transition-opacity placeholder:delay-75',
            (disabled || readOnly) && 'cursor-not-allowed hover:shadow-input',
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDownIcon
          className={mergeClassnames(
            'absolute top-1/2 end-3 -translate-y-1/2 z-5 pointer-events-none',
            'text-trunks flex-shrink-0 transition-transform',
            size === 'sm' ? 'text-moon-16' : 'text-moon-24',
          )}
        />
      </span>
    );
  },
);
NativeSelect.displayName = 'NativeSelect';

export default NativeSelect;
