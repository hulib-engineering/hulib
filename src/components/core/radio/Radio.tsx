import { RadioGroup } from '@headlessui/react';
import React, { forwardRef } from 'react';

import type { OptionProps, RadioProps } from './private/types';
import { mergeClassnames } from '@/components/core/private/utils';

const RadioRoot = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      defaultValue,
      value,
      onChange,
      children,
      className,
      disabled,
      name,
      ...rest
    },
    ref,
  ) => (
    <RadioGroup
      ref={ref}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
      name={name}
      {...rest}
    >
      {children}
    </RadioGroup>
  ),
);
RadioRoot.displayName = 'Radio';

const Option = ({ value, children, className, disabled }: OptionProps) => {
  const ariaLabelValue = value ? value.toString() : 'Radio option';

  return (
    <RadioGroup.Option
      value={value}
      disabled={disabled}
      className={mergeClassnames(
        'flex items-center gap-2 cursor-pointer text-sm leading-4 text-neutral-10 data-disabled:opacity-60',
        'data-disabled:cursor-default',
        className,
      )}
      aria-label={ariaLabelValue}
    >
      {children}
    </RadioGroup.Option>
  );
};

const Indicator = ({
  checked,
  className,
  isError,
}: {
  checked?: boolean;
  className?: string;
  isError?: boolean;
}) => (
  <div
    data-ui={checked ? 'checked' : ''}
    className={mergeClassnames(
      'relative flex items-center justify-center w-5 h-5 aspect-square m-0.5 rounded-full border',
      'transition-colors after:absolute after:w-0 after:h-0 after:rounded-full after:top-1/2',
      'after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:transition-all',
      'data-checked:after:w-3 data-checked:after:h-3 border-[#c8c8c8] data-checked:border-primary-50',
      'after:bg-primary-50',
      isError
      && 'input-err input-err hover:input-err focus:input-err focus-visible:input-err',
      className,
    )}
  />
);

const Radio = Object.assign(RadioRoot, { Option, Indicator });

export default Radio;
