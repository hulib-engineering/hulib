import type {
  DetailedHTMLProps,
  HTMLInputTypeAttribute,
  LabelHTMLAttributes,
} from 'react';
import React, { forwardRef } from 'react';

import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

type LabelProps = {
  className?: string;
  type?: HTMLInputTypeAttribute;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
} & Omit<
  DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
  'size'
>;

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
