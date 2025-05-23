import type {
  DetailedHTMLProps,
  HTMLInputTypeAttribute,
  LabelHTMLAttributes,
} from 'react';
import React, { forwardRef } from 'react';

import type { WithChildren } from './private/types';
import { mergeClassnames } from './private/utils';

interface LabelProps
  extends Omit<
    DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
    'size'
  > {
  className?: string;
  type?: HTMLInputTypeAttribute;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Label = forwardRef<HTMLLabelElement, WithChildren<LabelProps>>(
  (
    {
      children,
      disabled: labelDisabled,
      className,
      htmlFor,
      ...rest
    }: LabelProps,
    ref,
  ) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={mergeClassnames(
          'w-full block text-sm text-neutral-10 leading-4',
          labelDisabled && 'opacity-60 cursor-not-allowed',
          className && className,
        )}
        {...rest}
      >
        {children}
      </label>
    );
  },
);
Label.displayName = 'Label';

export default Label;
