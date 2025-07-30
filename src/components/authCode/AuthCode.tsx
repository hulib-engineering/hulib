import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import type { AuthCodeProps, AuthCodeRef } from './private/types';
import { allowedCharactersValues, propsMap } from './private/utils';
import { mergeClassnames } from '@/components/private/utils';

const AuthCode = forwardRef<AuthCodeRef, AuthCodeProps>(
  (
    {
      allowedCharacters = 'alphanumeric',
      ariaLabel,
      autoFocus = false,
      className,
      disabled,
      isPassword = false,
      length = 6,
      placeholder,
      onChange,
      isValid = true,
    },
    ref,
  ) => {
    if (Number.isNaN(length) || length < 1) {
      throw new Error('Length should be a number and greater than 0');
    }

    if (!allowedCharactersValues.includes(allowedCharacters)) {
      throw new Error(
        'Invalid value for allowedCharacters. Use alpha, numeric, or alphanumeric',
      );
    }

    const inputsRef = useRef<Array<HTMLInputElement>>([]);
    const inputProps = propsMap[allowedCharacters];

    const sendResult = () => {
      const res = inputsRef.current.map(input => input.value).join('');
      if (onChange) {
        onChange(res);
      }
    };

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputsRef && inputsRef.current && inputsRef.current.length > 0) {
          inputsRef.current[0]?.focus();
          // Sets the start and end positions of the current text selection
          inputsRef.current[0]?.setSelectionRange(0, 1);
        }
      },
      clear: () => {
        if (inputsRef && inputsRef.current && inputsRef.current.length > 0) {
          inputsRef.current.forEach((item) => {
            item.value = '';
          });
          inputsRef.current[0]?.focus();
        }
        sendResult();
      },
    }));

    useEffect(() => {
      if (autoFocus) {
        inputsRef.current[0]?.focus();
      }
    }, []);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value, nextElementSibling },
      } = e;
      if (value.length > 1) {
        e.target.value = value.charAt(0);
        if (nextElementSibling !== null) {
          (nextElementSibling as HTMLInputElement).focus();
        }
      } else if (value.match(new RegExp(inputProps?.pattern || '', 'gi'))) {
        if (nextElementSibling !== null) {
          (nextElementSibling as HTMLInputElement).focus();
        }
      } else {
        e.target.value = '';
      }
      sendResult();
    };

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      const target = e.target as HTMLInputElement;
      if (key === 'Backspace') {
        if (target.value === '') {
          if (target.previousElementSibling !== null) {
            const t = target.previousElementSibling as HTMLInputElement;
            t.value = '';
            t.focus();
            e.preventDefault();
          }
        } else {
          target.value = '';
        }
        sendResult();
      }
    };

    const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    };

    const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedValue = e.clipboardData.getData('Text');

      let currentInput = 0;

      for (let i = 0; i < pastedValue.length; i += 1) {
        const pastedCharacter = pastedValue.charAt(i);
        const currentValue = inputsRef.current[currentInput]?.value;
        if (pastedCharacter.match(inputProps?.pattern || '')) {
          if (!currentValue) {
            // @ts-ignore
            inputsRef.current[currentInput].value = pastedCharacter;
            if (
              inputsRef.current[currentInput]
              && inputsRef.current[currentInput]?.nextElementSibling !== null
            ) {
              (
                inputsRef.current[currentInput]
                  ?.nextElementSibling as HTMLInputElement
              ).focus();
              currentInput += 1;
            }
          }
        }
      }
      sendResult();

      e.preventDefault();
    };

    const inputs: React.JSX.Element[] = [];

    for (let i = 0; i < length; i += 1) {
      inputs.push(
        <input
          key={i}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          onFocus={handleOnFocus}
          onPaste={handleOnPaste}
          {...inputProps}
          type={isPassword ? 'password' : inputProps?.type}
          ref={(el: HTMLInputElement) => {
            inputsRef.current[i] = el;
          }}
          maxLength={1}
          className={mergeClassnames(
            'h-[68px] w-[68px] rounded-xl bg-neutral-98 text-2xl appearance-none',
            'border-2 border-solid border-neutral-90',
            'font-medium text-neutral-40 text-center hover:border-primary-50 py-4',
            'focus:shadow-[0px_0px_0px_4px_#CDDDFE] focus:outline-none',
            'focus-visible::shadow-[0px_0px_0px_4px_#CDDDFE] focus-visible::outline-none',
            !isValid && 'text-chichi border-red-50',
            disabled && 'bg-neutral-90 cursor-not-allowed',
          )}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={
            ariaLabel
              ? `${ariaLabel}. Character ${i + 1}`
              : `Character ${i + 1}`
          }
          disabled={disabled}
          placeholder={placeholder && placeholder[i]}
        />,
      );
    }

    return (
      <div className={mergeClassnames('flex gap-5', className)}>{inputs}</div>
    );
  },
);
AuthCode.displayName = 'AuthCode';

export default AuthCode;
