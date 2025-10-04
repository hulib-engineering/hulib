'use client';

import { Listbox } from '@headlessui/react';
import React, { Children, Fragment, useMemo, useState } from 'react';
import { usePopper } from 'react-popper';

import GenericHint from '../../Hint';

import type {
  DropdownRootProps,
  OptionProps,
  OptionsProps,
  SelectProps,
} from './private/types';
import { DropdownContext, useDropdownContext } from './private/utils';
import SelectButton from '@/components/core/selectButton/selectButton';

import { mergeClassnames } from '@/components/core/private/utils';
import type { WithChildren } from '@/components/core/private/types';
import {
  useFormContext,
  useFormItemContext,
} from '@/components/core/form/private/utils';

const DropdownRoot = ({
  children,
  value,
  onChange,
  isError: dropdownError,
  disabled: dropdownDisabled,
  size: dropdownSize = 'md',
  className,
  onClear,
  position = 'bottom-start',
  ...rest
}: DropdownRootProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>();
  const [popperEl, setPopperEl] = useState<HTMLElement | null>();

  const { size: formSize } = useFormContext('Input');
  const {
    size: formItemSize,
    disabled: formItemDisabled,
    error: formItemError,
  } = useFormItemContext('Input');

  const size = dropdownSize || formItemSize || formSize;
  const disabled = dropdownDisabled || formItemDisabled;
  const isError = dropdownError || formItemError;

  const { styles, attributes } = usePopper(anchorEl, popperEl, {
    placement: position,
  });

  const states = useMemo(
    () => ({
      value,
      isError,
      size,
      disabled,
      onClear,
      popper: {
        styles,
        attributes,
        setAnchor: setAnchorEl,
        setPopper: setPopperEl,
      },
    }),
    [attributes, disabled, isError, onClear, size, styles, value],
  );

  const childArray
    = typeof children !== 'function' ? Children.toArray(children) : [];
  const callableChildren = typeof children === 'function' && children;

  return (
    <DropdownContext.Provider value={states}>
      <div
        className={mergeClassnames('w-full relative', className && className)}
      >
        <Listbox
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        >
          {({ open }) => (
            <div className="relative">
              {typeof children === 'function'
                ? callableChildren && callableChildren({ open })
                : childArray?.map(ch => ch)}
            </div>
          )}
        </Listbox>
      </div>
    </DropdownContext.Provider>
  );
};

const Options = ({
  children,
  menuWidth,
  className,
  ...rest
}: WithChildren<OptionsProps>) => {
  const { popper } = useDropdownContext('MenuItem.Options');

  return (
    <Listbox.Options
      ref={popper?.setPopper}
      style={popper?.styles?.popper}
      {...popper?.attributes?.popper}
      className={mergeClassnames(
        menuWidth || 'w-full min-w-[7.25rem]',
        'max-h-80 overflow-y-auto z-[999] p-2 rounded-2xl box-border bg-white shadow-2xl',
        'flex flex-col gap-1 !my-1 dropdown-scrollbar',
        className && className,
      )}
      {...rest}
    >
      {children}
    </Listbox.Options>
  );
};

const Option = ({ children, value }: OptionProps) => {
  return (
    <Listbox.Option as="span" value={value}>
      {({ selected, active }) =>
        typeof children === 'function'
          ? children({ selected, active })
          : children}
    </Listbox.Option>
  );
};

const Select = ({
  open,
  label,
  placeholder,
  children,
  className,
  ...rest
}: WithChildren<SelectProps>) => {
  const { size, popper, isError, disabled }
    = useDropdownContext('Dropdown.Select');

  return (
    <>
      {label && (
        <SelectButton.Label isDisabled={disabled}>{label}</SelectButton.Label>
      )}
      <Listbox.Button as={Fragment}>
        <SelectButton
          size={size}
          open={open}
          isError={isError}
          isDisabled={disabled}
          ref={popper?.setAnchor}
          {...rest}
        >
          <SelectButton.Input className={className}>
            {children
              ? (
                  <SelectButton.Value>{children}</SelectButton.Value>
                )
              : (
                  <SelectButton.Placeholder>{placeholder}</SelectButton.Placeholder>
                )}
          </SelectButton.Input>
        </SelectButton>
      </Listbox.Button>
    </>
  );
};

// MenuItem.Trigger
const Trigger = ({
  children,
  className,
  ...rest
}: WithChildren<{ className?: string }>) => {
  const { popper } = useDropdownContext('MenuItem.Trigger');

  return (
    <Listbox.Button
      ref={popper?.setAnchor}
      className={className && className}
      {...rest}
    >
      {children}
    </Listbox.Button>
  );
};

const Hint = ({
  children,
  className,
}: WithChildren<{ className?: string }>) => {
  const { isError, disabled } = useDropdownContext('Dropdown.Input');
  return (
    <GenericHint error={isError} disabled={disabled} className={className}>
      {children}
    </GenericHint>
  );
};

// MenuItem
const Dropdown = Object.assign(DropdownRoot, {
  Options,
  Option,
  Select,
  Trigger,
  Hint,
});

export default Dropdown;
// TODO: Remove SelectButton.Label and and use Label
