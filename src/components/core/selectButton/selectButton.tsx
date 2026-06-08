import { Listbox } from '@headlessui/react';
import { CaretDown, X } from '@phosphor-icons/react';
import type { ReactNode, Ref } from 'react';
import React, { forwardRef, useCallback, useMemo } from 'react';

import type {
  ChipProps,
  InputProps,
  LabelProps,
  SelectButtonProps,
} from './private/types';
import {
  SelectButtonContext,
  useSelectButtonContext,
} from './private/utils';
import { mergeClassnames } from '@/components/core/private/utils';
import Tag from '@/components/core/tag/Tag';

const SelectButtonRoot = forwardRef(
  (
    {
      isError,
      isDisabled,
      open,
      children,
      ...rest
    }: SelectButtonProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const states = useMemo(
      () => ({
        open,
        isError,
        isDisabled,
        ...rest,
      }),
      [open, isError, isDisabled, rest],
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
  const { open } = useSelectButtonContext('SelectButton.Control');

  return (
    <CaretDown
      size={24}
      className={mergeClassnames(
        'text-neutral-20 flex-shrink-0 transition-transform',
        open && 'rotate-[-180deg]',
      )}
    />
  );
};

const Value = ({ children }: { children?: ReactNode }) => {
  const { isError, isDisabled } = useSelectButtonContext('SelectButton.Value');

  return (
    <span
      className={mergeClassnames(
        'w-full font-medium text-sm leading-4 truncate',
        isDisabled && 'text-neutral-40',
        isError && !isDisabled && 'text-red-50',
        !isError && !isDisabled && 'text-primary-60',
      )}
    >
      {children}
    </span>
  );
};

const Input = ({ children, className }: InputProps) => {
  const { isError, isDisabled, open, ...rest }
    = useSelectButtonContext('SelectButton.Input');

  const hasValue = React.isValidElement(children) && children.type === Value;

  return (
    <button
      {...rest}
      className={mergeClassnames(
        'h-11 flex items-center justify-between py-0.5 px-3 rounded-2xl',
        'size-full bg-neutral-98 border',
        'shadow-input hover:shadow-input-hov transition-shadow duration-200',
        'focus:shadow-input-focus focus:outline-none',
        open && !isError && 'border-primary-60',
        !open && hasValue && !isError && 'border-neutral-80',
        !open && !hasValue && !isError && 'border-neutral-90',
        isError
        && 'border-2 border-red-50',
        isDisabled
        && 'border-neutral-90 bg-neutral-90 text-neutral-40 cursor-not-allowed hover:shadow-input',
        className && className,
      )}
      type="button"
    >
      <span className="flex w-full flex-col justify-center overflow-hidden text-start text-sm font-normal leading-4 text-neutral-40">
        {children}
      </span>
      <Control />
    </button>
  );
};

const Label = ({
  children,
  isDisabled,
  htmlFor = '',
}: LabelProps) => {
  return (
    <Listbox.Label
      className={mergeClassnames(
        'block text-neutral-10 pb-2 text-sm leading-4',
        isDisabled && 'cursor-not-allowed',
      )}
      htmlFor={htmlFor}
    >
      {children}
    </Listbox.Label>
  );
};

const Placeholder = ({ children }: { children?: ReactNode }) => {
  const { isError } = useSelectButtonContext('SelectButton.Placeholder');

  return (
    <span
      className={mergeClassnames(
        'w-full text-sm leading-4 text-start truncate',
        isError ? 'text-red-50' : 'text-neutral-40',
      )}
    >
      {children}
    </span>
  );
};

const Chip = ({
  children,
  onClear,
  isUppercase,
  iconClassName,
  onClick,
  ...rest
}: ChipProps) => {
  const onCloseHandler = useCallback(
    (e: any) => {
      e.preventDefault();
      if (onClear) {
        onClear();
      }
    },
    [onClear],
  );

  return (
    <Tag
      size="xs"
      onClick={onClick}
      iconRight={(
        <X onClick={onCloseHandler} className={mergeClassnames('text-neutral-98', iconClassName)} />
      )}
      isUppercase={isUppercase}
      {...rest}
    >
      {children}
    </Tag>
  );
};

const SelectButton = Object.assign(SelectButtonRoot, {
  Input,
  Label,
  Value,
  Placeholder,
  Chip,
});

export default SelectButton;
