import { Listbox } from '@headlessui/react';
import { CaretDown } from '@phosphor-icons/react';
import type { ReactNode, Ref } from 'react';
import React, { forwardRef, useMemo } from 'react';

import { mergeClassnames } from '@/components/private/utils';

import type {
  InputProps,
  LabelProps,
  SelectButtonProps,
} from './private/types';
import {
  getSelectSize,
  SelectButtonContext,
  useSelectButtonContext,
} from './private/utils';

const SelectButtonRoot = forwardRef(
  (
    {
      size = 'md',
      isError,
      idDisabled,
      open,
      children,
      ...rest
    }: SelectButtonProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const states = useMemo(
      () => ({
        open,
        size,
        isError,
        idDisabled,
        ...rest,
      }),
      [open, size, isError, idDisabled, rest],
    );
    return (
      <div className="relative" ref={ref}>
        <SelectButtonContext.Provider value={states}>
          {children}
        </SelectButtonContext.Provider>
      </div>
    );
  },
);
SelectButtonRoot.displayName = 'SelectButtonRoot';

const Control = () => {
  const { open, size } = useSelectButtonContext('SelectButton.Control');

  return (
    <CaretDown
      size={size === 'sm' ? 16 : 24}
      className={mergeClassnames(
        'text-trunks flex-shrink-0 transition-transform',
        open && 'rotate-[-180deg]',
      )}
    />
  );
};

const Input = ({ children, className }: InputProps) => {
  const { size, isError, idDisabled, ...rest } =
    useSelectButtonContext('SelectButton.Input');

  return (
    <button
      {...rest}
      className={mergeClassnames(
        'flex items-center justify-between pl-3 pr-4 py-0.5',
        'w-full bg-neutral-98 border border-neutral-90 rounded-2xl',
        'shadow-input hover:shadow-input-hov transition-shadow duration-200',
        'focus:shadow-input-focus focus:outline-none',
        getSelectSize(size),
        isError &&
          'shadow-input-err hover:shadow-input-err focus:shadow-input-err',
        idDisabled && 'opacity-60 cursor-not-allowed hover:shadow-input',
        className && className,
      )}
      type="button"
    >
      <span className="flex w-full flex-col items-start overflow-hidden py-3 text-start">
        {children}
      </span>
      <Control />
    </button>
  );
};

const Value = ({ children }: { children?: ReactNode }) => {
  // const { size } = useSelectButtonContext('SelectButton.Value');

  return (
    <span
      className={mergeClassnames(
        // size === 'sm' ? 'text-moon-14' : 'text-moon-16',
        'w-full font-medium text-sm leading-4 text-neutral-10 truncate',
      )}
    >
      {children}
    </span>
  );
};

const Label = ({ children, idDisabled }: LabelProps) => (
  <Listbox.Label
    className={mergeClassnames(
      'block text-neutral-10 text-sm leading-4 pb-2',
      idDisabled && 'opacity-60 cursor-not-allowed',
    )}
  >
    {children}
  </Listbox.Label>
);

const Placeholder = ({ children }: { children?: ReactNode }) => {
  // const { size } = useSelectButtonContext('SelectButton.Placeholder');

  return (
    <span
      className={mergeClassnames(
        // size === 'sm' ? 'text-moon-14' : 'text-moon-16',
        'w-full text-sm leading-4 text-neutral-40 text-start truncate',
      )}
    >
      {children}
    </span>
  );
};

const SelectButton = Object.assign(SelectButtonRoot, {
  Input,
  Label,
  Value,
  Placeholder,
});

export default SelectButton;
