'use client';

import { Listbox } from '@headlessui/react';
import React, { useMemo, useState } from 'react';
import { usePopper } from 'react-popper';

import type {
  DropdownRootProps,
  OptionProps,
  OptionsProps,
} from '@/components/dropdown/private/types';
import {
  useFormContext,
  useFormItemContext,
} from '@/components/form/private/utils';
import type { WithChildren } from '@/components/private/types';
import { mergeClassnames } from '@/components/private/utils';

import { DropdownContext, useDropdownContext } from './private/utils';

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

  // const states = {
  //   value,
  //   isError,
  //   size,
  //   disabled,
  //   onClear,
  //   popper: {
  //     styles,
  //     attributes,
  //     setAnchor: setAnchorEl,
  //     setPopper: setPopperEl,
  //   },
  // };

  const childrens =
    typeof children !== 'function' ? React.Children.toArray(children) : [];
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
                : childrens?.map((ch) => ch)}
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
        'z-5 mt-1 p-1 rounded-lg box-border bg-white shadow flex flex-col gap-1',
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
          : children
      }
    </Listbox.Option>
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

// MenuItem
const Dropdown = Object.assign(DropdownRoot, {
  Options,
  Option,
  Trigger,
});

export default Dropdown;
// TODO: Remove SelectButton.Label and and use Label
