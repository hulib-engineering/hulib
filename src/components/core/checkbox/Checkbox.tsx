import type { InputHTMLAttributes } from 'react';
import { forwardRef, useEffect, useState } from 'react';

import { CheckCircle, CheckSquare, Circle, MinusSquare, Square } from '@phosphor-icons/react';
import { mergeClassnames } from '@/components/core/private/utils';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  ariaLabel?: string;
  className?: string;
  indeterminate?: boolean;
  shape?: 'square' | 'round';
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      ariaLabel,
      className,
      indeterminate,
      shape = 'square',
      ...rest
    },
    ref,
  ) => {
    const ariaLabelValue = ariaLabel || (rest['aria-label']
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
      <div
        className={mergeClassnames(
          'relative size-6 shrink-0',
          rest.disabled && 'opacity-60 cursor-not-allowed',
          rest.readOnly && 'cursor-not-allowed',
          className && className,
        )}
      >
        <input
          id={rest.id}
          disabled={rest.disabled}
          readOnly={rest.readOnly}
          aria-label={ariaLabelValue}
          ref={ref}
          className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
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
            'absolute -inset-0.5 rounded-full transition-colors pointer-events-none',
            'peer-hover:bg-neutral-90',
            'peer-focus-visible:bg-neutral-90 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-60 peer-focus-visible:ring-offset-2',
            'peer-active:bg-neutral-90 peer-active:border peer-active:border-neutral-70',
          )}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl"
          aria-hidden="true"
        >
          {indeterminate
            ? (
                <MinusSquare
                  className={rest.disabled ? 'text-neutral-70' : 'text-primary-50'}
                />
              )
            : isChecked
              ? (
                  shape === 'round'
                    ? (
                        <CheckCircle
                          weight="fill"
                          className={rest.disabled ? 'text-neutral-70' : 'text-primary-50'}
                        />
                      )
                    : (
                        <CheckSquare
                          weight="fill"
                          className={rest.disabled ? 'text-neutral-70' : 'text-primary-50'}
                        />
                      )
                )
              : (
                  shape === 'round'
                    ? (
                        <Circle
                          weight="bold"
                          className={rest.disabled ? 'text-neutral-70' : 'text-neutral-40'}
                        />
                      )
                    : (
                        <Square
                          weight="bold"
                          className={rest.disabled ? 'text-neutral-70' : 'text-neutral-40'}
                        />
                      )
                )}
        </span>
      </div>
    );
  },
);

export default Checkbox;
