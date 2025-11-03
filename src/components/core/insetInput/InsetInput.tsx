import React, { forwardRef, useEffect, useMemo } from 'react';

import { useFormItemContext } from '../form/private/utils';
import { getMaxDate, getTypeStyles } from '../input/private/utils';

import type { InsetInputProps, LabelProps } from './private/types';
import { InsetInputContext, useInsetInputContext } from './private/utils';

import { mergeClassnames, useRegisterChild } from '@/components/core/private/utils';

const InsetInputRoot = forwardRef<HTMLInputElement, InsetInputProps>(
  ({ className, error: inputError, children, ...rest }, ref) => {
    const { disabled: formItemDisabled, error: formItemError }
      = useFormItemContext('Input');
    const disabled = rest.disabled || formItemDisabled;
    const error = inputError || formItemError;

    const { items: state, register } = useRegisterChild();

    const values = useMemo(
      () => ({ ...state, registerChild: register }),
      [state, register],
    );

    const isLabel = state?.some(name => name === 'Label');

    return (
      <InsetInputContext.Provider value={values}>
        <div
          className={mergeClassnames(
            'w-full relative rounded-lg bg-neutral-98',
            disabled && 'opacity-60 cursor-not-allowed',
            className && className,
          )}
        >
          <input
            ref={ref}
            type={rest.type}
            id={rest.id}
            disabled={disabled}
            max={getMaxDate(rest.type)}
            className={mergeClassnames(
              'block w-full py-0 px-3 m-0 appearance-none text-sm text-neutral-40',
              'transition-colors box-border relative z-[2] bg-transparent outlined-input',
              'hover:shadow-input-hov focus:shadow-input-focus',
              'focus-visible:shadow-input-focus h-[60px] leading-5',
              'rounded-lg placeholder:text-neutral-20 placeholder:font-light placeholder:opacity-100',
              'placeholder:transition-opacity placeholder:delay-75 read-only:outline-0',
              'read-only:border-none read-only:cursor-not-allowed read-only:hover:outlined-input',
              'read-only:focus:outlined-input read-only:focus-visible:outlined-input',
              'invalid:shadow-input-err invalid:hover:shadow-input-err input-xl-dt-shared',
              'invalid:focus:shadow-input-err invalid:focus-visible:shadow-input-err',
              error
              && 'shadow-input-err hover:shadow-input-err focus:shadow-input-err focus-visible:shadow-input-err',
              getTypeStyles(rest.type),
              isLabel && 'input-xl pt-[28px] input-xl-dt-label',
            )}
            {...rest}
          />
          {children}
        </div>
      </InsetInputContext.Provider>
    );
  },
);

const Label = ({ children, className }: LabelProps) => {
  const { registerChild } = useInsetInputContext('Label');

  useEffect(() => {
    if (registerChild) {
      registerChild('Label');
    }
  }, []);

  return (
    <label
      className={mergeClassnames(
        'absolute text-[10px] leading-3 text-neutral-20 top-3 start-3 z-[1] transition-all',
        className,
      )}
    >
      {children}
    </label>
  );
};

const InsetInput = Object.assign(InsetInputRoot, { Label });

export default InsetInput;
