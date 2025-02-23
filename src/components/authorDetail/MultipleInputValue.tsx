import { X } from '@phosphor-icons/react';
import React from 'react';

import { mergeClassnames } from '@/components/private/utils';

export enum KeyBoard {
  Del = 'Backspace',
  Delete = 'Delete',
  Enter = 'Enter',
}

const DEFAULT_MIN_EMAILS_INPUT = 1;

type ValueTagProp = {
  value: string;
  canRemove?: boolean;
  onRemove?: () => void;
  className: string;
};
export const ValueTag = ({
  value,
  canRemove,
  onRemove,
  className,
}: ValueTagProp) => {
  return (
    <div
      className={mergeClassnames(
        'flex items-center gap-x-1.5 rounded-full px-3 py-2 text-xs',
        className,
      )}
    >
      <p>{value}</p>
      {canRemove && (
        <button type="button" onClick={onRemove}>
          <X size={16} color="#F0F5FF" />
        </button>
      )}
    </div>
  );
};

type Props = {
  placeholder: string;
  onChangeValues: (values: string[]) => void;
};

export type FormHandlers = {
  onReset: () => void;
  triggerValidateAndAddEmailInput: () => Promise<{
    isValid: boolean;
    emails: string[];
  }>;
};

export const MultipleInputValue = React.forwardRef<FormHandlers, Props>(
  function MultipleInputValue({
    onChangeValues,
    placeholder,
  }: Props): React.ReactElement {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [inputVal, setInputVal] = React.useState<string>('');
    const [values, setValues] = React.useState<string[]>([]);
    const [errorMsg, setErrorMsg] = React.useState<string>('');

    const focusInput = React.useCallback(() => {
      textareaRef.current?.focus();
    }, []);

    React.useEffect(() => {
      focusInput();
    }, [focusInput]);

    const onChangeValueList = React.useCallback(
      (selectedValues: string[]) => {
        setValues([...selectedValues]);
        onChangeValues?.([...selectedValues]);
      },
      [onChangeValues],
    );

    const clearError = () => {
      setErrorMsg('');
    };

    const clearInput = () => {
      setInputVal('');
    };

    const onAddValue = React.useCallback(
      (value: string) => {
        clearError();
        clearInput();
        onChangeValueList([...values, value.trim()]);
        setTimeout(() => {
          textareaRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start',
          });
        }, 100);
      },
      [values, onChangeValueList],
    );

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const targetValue = e.currentTarget.value;
      setInputVal(targetValue);
    };

    const onDeleteTheLastEmail = () => {
      if (values?.length > DEFAULT_MIN_EMAILS_INPUT) {
        const newValues = [...values];
        newValues.splice(-1);
        onChangeValueList([...newValues]);
      }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const {
        key,
        currentTarget: { value },
      } = e;
      if ([KeyBoard.Enter].includes(key as KeyBoard)) {
        e.preventDefault();
        if (value?.length) {
          onAddValue(value);
        }
      }

      if ([KeyBoard.Del].includes(key as KeyBoard) && !value?.length) {
        e.preventDefault();
        onDeleteTheLastEmail();
      }

      if ([KeyBoard.Delete].includes(key as KeyBoard) && !value?.length) {
        e.preventDefault();
        onDeleteTheLastEmail();
      }
    };

    const onRemoveTag = (idx: number) => {
      focusInput();
      const newValues = [...values].filter((_, itemIndex) => idx !== itemIndex);
      onChangeValueList([...newValues]);
    };

    return (
      <div className="flex w-full flex-col">
        <div className="relative flex min-h-12 w-full flex-wrap items-center justify-center gap-1 overflow-x-hidden rounded-lg border border-neutral-90 bg-neutral-98 p-2">
          <div className="flex flex-wrap items-center gap-2">
            {values.map((val, idx) => (
              <ValueTag
                value={val}
                key={idx}
                canRemove
                onRemove={() => onRemoveTag(idx)}
                className="bg-primary-50 px-3 py-2 text-neutral-98"
              />
            ))}
          </div>
          <textarea
            ref={textareaRef}
            className="flex flex-1 resize-none items-center justify-center bg-neutral-98 text-xs text-black focus:outline-none"
            value={inputVal}
            onKeyDown={onKeyDown}
            onChange={onChange}
            placeholder={placeholder}
            rows={1}
          />
        </div>
        <p className="">{errorMsg}</p>
      </div>
    );
  },
);
