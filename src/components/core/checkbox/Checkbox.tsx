import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useEffect, useState } from 'react';

import { CheckSquare, MinusSquare, Square } from '@phosphor-icons/react';
import { mergeClassnames } from '@/components/core/private/utils';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode | string;
  ariaLabel?: string;
  bgColor?: string;
  className?: string;
  indeterminate?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      ariaLabel,
      label,
      className,
      indeterminate,
      ...rest
    },
    ref,
  ) => {
    const ariaLabelValue = label
      ? undefined
      : ariaLabel || (rest['aria-label']
        ? rest['aria-label']
        : rest.name
          ? rest.name
          : 'Checkbox');

    const [isChecked, setIsChecked] = useState(rest.checked || false);

    useEffect(() => {
      if (typeof rest.checked !== 'undefined' && rest.checked !== isChecked) {
        setIsChecked(rest.checked);
      }
    }, [isChecked, rest.checked]);

    return (
      <label
        htmlFor={rest.id}
        className={mergeClassnames(
          'relative rounded-full flex p-1 items-center gap-3 text-sm text-neutral-10 cursor-pointer',
          'hover:bg-neutral-90',
          'focus-visible:border focus-visible:border-neutral-70 focus-visible:bg-neutral-90',
          rest.disabled && 'opacity-60 cursor-not-allowed select-none',
          rest.readOnly && 'cursor-not-allowed select-none',
        )}
      >
        <input
          id={rest.id}
          disabled={rest.disabled}
          readOnly={rest.readOnly}
          aria-label={ariaLabelValue}
          ref={ref}
          className="peer size-5 select-none appearance-none align-top outline-none"
          type="checkbox"
          aria-checked={indeterminate ? 'mixed' : isChecked}
          checked={isChecked}
          onClick={(e) => {
            if (rest.disabled || rest.readOnly) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            if (rest.onClick) {
              rest.onClick(e);
            }
            setIsChecked(e?.currentTarget?.checked);
          }}
          onChange={rest.onChange ? rest.onChange : () => {}}
          {...rest}
        />
        <span
          className={mergeClassnames(
            'absolute inset-0 flex items-center justify-center p-1 transition-colors text-xl',
            'peer-focus:bg-neutral-90 peer-checked:shadow-none peer-focus:shadow-[0_0_0_2px_#0858FA] peer-focus:p-1 peer-focus:rounded-full',
            indeterminate && 'shadow-none',
            className && className,
          )}
          aria-hidden="true"
        >
          {indeterminate ? (
            <MinusSquare className="text-xl text-primary-50 opacity-100 transition-opacity" />
          )
            : isChecked
              ? (
                  <CheckSquare
                    weight="fill"
                    className={mergeClassnames(
                      'transition-colors',
                      isChecked ? 'opacity-100' : 'opacity-0',
                      rest.disabled ? 'text-neutral-70' : 'text-primary-50',
                    )}
                  />
                ) : (
                  <Square
                    weight="bold"
                    className={mergeClassnames(
                      'transition-opacity',
                      isChecked ? 'opacity-0' : 'opacity-100',
                      rest.disabled ? 'text-neutral-70' : 'text-neutral-40',
                    )}
                  />
                )}
        </span>
        {label}
      </label>
    );
  },
);

export default Checkbox;
