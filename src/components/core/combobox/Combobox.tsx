import type { FocusEvent } from 'react';
import React, { Children, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Combobox as HeadlessCombobox,
  Transition as HeadlessTransition,
  Listbox,
} from '@headlessui/react';
import { usePopper } from 'react-popper';
import useDeepCompareEffect from 'use-deep-compare-effect';

import type {
  ButtonProps,
  ComboboxRootProps,
  InputProps,
  OptionProps,
  OptionsProps,
  SelectProps,
} from './private/types';
import { ComboboxContext, getSizeStyles, useComboboxContext } from './private/utils';
import { assignRef, mergeClassnames } from '@/components/core/private/utils';
import type { WithChildren } from '@/components/core/private/types';
import NativeInput from '@/components/core/input/Input';
import SelectButton from '@/components/core/selectButton/selectButton';

import useClickOutside from '@/libs/hooks/useClickOutside';

const ComboboxRoot = ({
  value,
  children,
  onChange,
  isError,
  disabled,
  size = 'md',
  className,
  onClear,
  onQueryChange,
  multiple,
  nullable,
  position = 'bottom-start',
  placeholder,
  displayValue,
  defaultValue,
  ref,
  ...rest
}: ComboboxRootProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>();
  const [popperEl, setPopperEl] = useState<HTMLElement | null>();
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const { styles, attributes, forceUpdate } = usePopper(anchorEl, popperEl, {
    placement: position,
  });

  const comboboxButtonRef = useRef<HTMLButtonElement | null>(null);

  useDeepCompareEffect(() => {
    if (value && anchorEl) {
      const input = anchorEl.querySelector('input');
      if (input) {
        input.value = '';
      }

      onQueryChange?.('');
    }
  }, [value]);

  const handleOnFocus = useCallback(
    (
      event: FocusEvent<HTMLInputElement>,
      preventButtonForceClick = false,
    ) => {
      setIsInputFocused(true);

      if (
        event.relatedTarget?.id?.includes('headlessui-combobox-button')
        || preventButtonForceClick
      ) {
        return;
      }

      comboboxButtonRef?.current?.click();
    },
    [setIsInputFocused, comboboxButtonRef],
  );
  const handleOnBlur = useCallback(() => {
    setIsInputFocused(false);
  }, [setIsInputFocused]);

  const states = useMemo(
    () => ({
      value,
      displayValue,
      isError,
      size,
      disabled,
      input: {
        isFocused: isInputFocused,
        setIsFocused: setIsInputFocused,
      },
      multiple,
      onClear,
      onQueryChange,
      popper: {
        forceUpdate,
        styles,
        attributes,
        setAnchor: setAnchorEl,
        setPopper: setPopperEl,
      },
      comboboxButtonRef,
      handleOnFocus,
      handleOnBlur,
    }),
    [
      value,
      displayValue,
      isError,
      size,
      disabled,
      isInputFocused,
      setIsInputFocused,
      multiple,
      onClear,
      onQueryChange,
      forceUpdate,
      styles,
      attributes,
      setAnchorEl,
      setPopperEl,
      comboboxButtonRef,
      handleOnFocus,
      handleOnBlur,
    ],
  );

  const childArray
    = typeof children !== 'function' ? Children.toArray(children) : [];
  const callableChildren = typeof children === 'function' && children;

  return (
    <ComboboxContext.Provider value={states}>
      <div className={mergeClassnames('w-full relative', className)}>
        <HeadlessCombobox
          // type coercion due to following issues in HeadlessUI combobox
          // https://github.com/tailwindlabs/headlessui/issues/2438
          // https://github.com/tailwindlabs/headlessui/issues/2434
          // https://codesandbox.io/s/festive-curran-ic7y9n?file=/src/ComboboxMultiple.tsx:527-565
          value={value as {}[]}
          multiple={multiple as true}
          nullable={nullable as true}
          onChange={onChange}
          disabled={disabled}
          ref={ref}
          {...rest}
        >
          {({ open }) => (
            <>
              {typeof children === 'function'
                ? callableChildren && callableChildren({ open })
                : childArray?.map(ch => ch)}
            </>
          )}
        </HeadlessCombobox>
      </div>
    </ComboboxContext.Provider>
  );
};

const Trigger = forwardRef<HTMLDivElement, WithChildren<SelectProps>>(
  ({ children, className, innerLabel, open, onClose }, ref) => {
    const { value, size, input, popper, disabled }
      = useComboboxContext('Combobox.Trigger');

    useEffect(() => {
      if (!open && typeof onClose === 'function') {
        onClose(value);
      }
    }, [onClose, open, value]);

    return (
      <div
        tabIndex={-1}
        className={mergeClassnames(
          'relative',
          'flex flex-nowrap w-full align-middle items-center border border-neutral-80 rounded-2xl py-0.5 px-3 bg-neutral-98 text-neutral-10',
          'placeholder:text-neutral-40',
          getSizeStyles(size as string, innerLabel as boolean),
          input?.isFocused && 'border-primary-60',
          'focus:border-primary-60 focus:outline-none',
          'focus-visible::border-primary-60 focus-visible::outline-none',
          // isError && 'shadow-input-err hover:shadow-input-err focus:shadow-input-err focus-visible:shadow-input-err',
          disabled && 'opacity-60 border-neutral-90 focus:border-neutral-90 hover:border-neutral-90 cursor-not-allowed',
          className,
        )}
        ref={(nodeElement) => {
          popper?.setAnchor(nodeElement);
          assignRef(ref, nodeElement);
        }}
      >
        {children}
      </div>
    );
  },
);

const SelectedItem = forwardRef<
  HTMLElement,
  {
    index: number | string;
    label: number | string;
    iconClassname?: string;
  } & SelectProps
>(
  (
    {
      open,
      className,
      iconClassname,
      index,
      label,
      ...rest
    }: {
      index: number | string;
      label: number | string;
      iconClassname?: string;
    } & SelectProps,
    ref,
  ) => {
    const { size, isError, disabled, onClear }
      = useComboboxContext('Combobox.Counter');

    return (
      <span
        className={mergeClassnames(
          'flex gap-2 items-center flex-grow-0 flex-shrink-0 self-center',
          className,
        )}
      >
        <SelectButton
          size={size}
          open={open}
          isError={isError}
          isDisabled={disabled}
          {...rest}
          ref={(nodeElement) => {
            assignRef(ref, nodeElement);
          }}
        >
          <SelectButton.Value>
            <SelectButton.Chip
              className={iconClassname}
              onClear={() => onClear && onClear(index)}
            >
              {label}
            </SelectButton.Chip>
          </SelectButton.Value>
        </SelectButton>
      </span>
    );
  },
);

const VisualSelectInput = forwardRef<HTMLElement, InputProps>(
  (
    {
      displayValue,
      placeholder,
      type,
      className,
      label,
      preventButtonForceClick,
      ...rest
    }: InputProps,
    ref,
  ) => {
    const {
      value,
      // size,
      popper,
      disabled,
      isError,
      onQueryChange,
      handleOnFocus,
      handleOnBlur,
    } = useComboboxContext('Combobox.VisualSelectInput');

    const selected = value as [];

    return (
      <span
        className={mergeClassnames(
          'w-full flex flex-wrap items-center',
          !selected.length ? 'gap-x-0' : 'gap-x-2',
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {selected.map(({ id, label }) => {
            return <SelectedItem key={id} index={id} label={label} />;
          })}
        </div>
        <HeadlessCombobox.Input
          onChange={({ target: { value } }) => {
            if (onQueryChange) {
              onQueryChange(value);
            }
          }}
          as={NativeInput}
          displayValue={displayValue}
          placeholder={placeholder === undefined ? '' : `${placeholder}`}
          type={type || 'text'}
          disabled={disabled}
          className={mergeClassnames(
            'flex-grow w-full h-full border-0 !rounded-none bg-transparent px-0 py-2 pr-1',
            'font-medium text-sm text-neutral-10 leading-4',
            '!shadow-none placeholder:text-neutral-40 hover:shadow-none focus:shadow-none focus-visible:shadow-none',
            label !== undefined
            && (placeholder === undefined || placeholder.length === 0)
            && 'input-xl',
            label !== undefined && 'pt-3 input-xl-dt-label',
            // getTextSizes(size),
            className,
          )}
          error={isError}
          aria-label={rest['aria-label']}
          {...rest}
          ref={(nodeElement) => {
            popper?.setAnchor(nodeElement);
            assignRef(ref, nodeElement);
          }}
          onFocus={(e) => {
            if (!handleOnFocus) {
              return;
            }

            handleOnFocus(e, preventButtonForceClick);
          }}
          onBlur={handleOnBlur}
        />
      </span>
    );
  },
);

const Button = ({
  open,
  children,
  label,
  className,
  'aria-label': ariaLabel,
  ...rest
}: WithChildren<ButtonProps>) => {
  const { size, disabled, comboboxButtonRef }
    = useComboboxContext('Combobox.Button');

  const ariaLabelValue = ariaLabel || (open ? 'Close' : 'Open');

  return (
    <HeadlessCombobox.Button
      className={mergeClassnames(
        'w-6 h-6',
        size === 'sm' ? 'w-4 h-4 text-[16px]' : 'text-2xl',
        open && '-rotate-180',
        'text-neutral-20 transition-transform flex-grow-0 flex-shrink-0 self-center',
        disabled && 'cursor-not-allowed',
        className,
      )}
      ref={comboboxButtonRef}
      aria-label={ariaLabelValue}
      {...rest}
    >
      {children}
    </HeadlessCombobox.Button>
  );
};

const Options = forwardRef<HTMLElement, WithChildren<OptionsProps>>(
  (
    {
      children,
      menuWidth,
      className,
      open,
      ...rest
    }: WithChildren<OptionsProps>,
    ref,
  ) => {
    const { popper } = useComboboxContext('Combobox.Options');

    const OptionsComponent = (
      <HeadlessCombobox.Options
        ref={(nodeElement) => {
          popper?.setPopper(nodeElement);
          assignRef(ref, nodeElement);
        }}
        style={popper?.styles?.popper}
        {...popper?.attributes?.popper}
        static={open ?? true}
        className={mergeClassnames(
          menuWidth || 'w-full max-h-[332px] p-2 my-1 rounded-2xl box-border bg-white shadow-lg absolute',
          'z-10 overflow-y-auto',
          className,
        )}
        {...rest}
      >
        {children}
      </HeadlessCombobox.Options>
    );

    if (open === undefined) {
      return OptionsComponent;
    }

    return open && OptionsComponent;
  },
);

const Option = forwardRef<HTMLElement, OptionProps>(
  ({ children, value }: OptionProps, ref) => {
    return (
      <HeadlessCombobox.Option
        as="span"
        value={value}
        ref={(nodeElement) => {
          assignRef(ref, nodeElement);
        }}
      >
        {({ selected, disabled, active }) =>
          typeof children === 'function'
            ? children({ selected, disabled, active })
            : children}
      </HeadlessCombobox.Option>
    );
  },
);

const Transition = ({ children, ...rest }: WithChildren) => {
  const { onQueryChange } = useComboboxContext('Combobox.Counter');

  return (
    <HeadlessTransition
      as="div"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={onQueryChange ? () => onQueryChange('') : () => {}}
      {...rest}
    >
      {children}
    </HeadlessTransition>
  );
};

const VisualMultiSelect = forwardRef<
  HTMLElement,
  WithChildren<SelectProps & InputProps> & { forceUpdate?: boolean; inputClassname?: string }
>(
  (
    {
      open,
      label,
      placeholder,
      children,
      className,
      multiple = true,
      counter,
      displayValue,
      forceUpdate,
      inputClassname,
      ...rest
    }: WithChildren<SelectProps & InputProps> & { forceUpdate?: boolean; inputClassname?: string },
    ref,
  ) => {
    const { size, popper, disabled, value } = useComboboxContext(
      'Combobox.VisualMultiSelect',
    );

    const [, hasClickedOutside] = useClickOutside();

    useEffect(() => {
      // Do nothing if forceUpdate is false.
      if (!forceUpdate) {
        return;
      }
      if (typeof popper?.forceUpdate === 'function') {
        popper.forceUpdate();
      }
    }, [forceUpdate, popper, value]);

    const shouldPreventForceClick = open && !hasClickedOutside;

    return (
      <Listbox by="id">
        {label && (
          <SelectButton.Label labelSize={size} isDisabled={disabled}>
            {label}
          </SelectButton.Label>
        )}
        <Listbox.Button
          open={open}
          as={Trigger}
          ref={(nodeElement) => {
            popper?.setAnchor(nodeElement);
            assignRef(ref, nodeElement);
          }}
          className={className}
          multiple={multiple}
          {...rest}
        >
          <VisualSelectInput
            open={open}
            placeholder={placeholder}
            displayValue={displayValue}
            aria-label={rest['aria-label']}
            preventButtonForceClick={shouldPreventForceClick}
            className={inputClassname}
          />
          <Button open={open}>{children}</Button>
        </Listbox.Button>
      </Listbox>
    );
  },
);

const Combobox = Object.assign(ComboboxRoot, {
  VisualSelectInput,
  Options,
  Option,
  Transition,
  VisualMultiSelect,
});

export default Combobox;
