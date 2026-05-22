'use client';

import { Switch as HeadlessSwitch } from '@headlessui/react';

import type { SwitchProps } from './private/types';

import { mergeClassnames } from '@/components/core/private/utils';

const Switch = ({
  checked,
  onChange,
  disabled,
  className,
  thumbClassName,
  srLabel,
  'aria-label': ariaLabel,
}: SwitchProps) => {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={mergeClassnames(
        'relative inline-flex h-10 w-20 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-60 focus-visible:ring-offset-2',
        checked ? 'bg-primary-60' : 'bg-neutral-80',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      {srLabel ? <span className="sr-only">{srLabel}</span> : null}
      <span
        aria-hidden
        className={mergeClassnames(
          'pointer-events-none absolute top-1 size-8 rounded-full bg-white shadow-sm transition-[left] duration-200 ease-in-out',
          checked ? 'left-[44px]' : 'left-1',
          thumbClassName,
        )}
      />
    </HeadlessSwitch>
  );
};

export default Switch;
