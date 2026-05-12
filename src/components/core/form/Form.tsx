import React, {
  forwardRef,
  useId,
  useMemo,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Controller, FormProvider } from 'react-hook-form';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import type { FormProps, ItemProps, LabelProps } from './private/types';
import {
  FormContext,
  FormFieldContext,
  FormItemIdContext,
  useFormField,
} from './private/utils';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

const FormRoot = forwardRef<HTMLFormElement, WithChildren<FormProps>>(
  ({ children, size = 'md', form, className, onSubmit, ...rest }, ref) => {
    const state = useMemo(() => ({ size }), [size]);

    const content = (
      <FormContext.Provider value={state}>
        <form
          {...rest}
          className={mergeClassnames(className)}
          onSubmit={onSubmit}
          ref={ref}
        >
          {children}
        </form>
      </FormContext.Provider>
    );

    if (form) {
      return <FormProvider {...form}>{content}</FormProvider>;
    }

    return content;
  },
);
FormRoot.displayName = 'FormRoot';

const Field = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) => {
  const fieldContextValue = useMemo(
    () => ({ name: props.name }),
    [props.name],
  );

  return (
    <FormFieldContext.Provider value={fieldContextValue}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const Item = ({
  children,
  disabled,
  className,
}: WithChildren<ItemProps>) => {
  const id = useId();

  const itemIdContext = useMemo(() => ({ id }), [id]);

  return (
    <FormItemIdContext.Provider value={itemIdContext}>
      <div
        className={mergeClassnames(
          'w-full max-w-full relative',
          disabled && 'opacity-60 cursor-not-allowed',
          className && className,
        )}
      >
        {children}
      </div>
    </FormItemIdContext.Provider>
  );
};

const Label = ({ children, required, htmlFor }: LabelProps) => {
  const field = useFormField();

  return (
    <label
      htmlFor={htmlFor ?? field.formItemId}
      data-error={field.invalid || undefined}
      className={mergeClassnames(
        'w-full block pb-2 text-sm font-normal leading-4 text-neutral-10',
        field.invalid && 'text-red-50',
      )}
    >
      {children}
      {required && (
        <span className="text-sm font-normal leading-4 text-red-50">*</span>
      )}
    </label>
  );
};

const Control = ({ children }: { children: React.ReactNode }) => {
  const field = useFormField();

  return (
    <Slot
      id={field.formItemId}
      aria-describedby={
        !field.invalid
          ? field.formDescriptionId
          : `${field.formDescriptionId} ${field.formMessageId}`
      }
      aria-invalid={field.invalid || undefined}
    >
      {children}
    </Slot>
  );
};

const Message = ({
  className,
  children,
}: WithChildren<{ className?: string }>) => {
  const field = useFormField();
  const body = field.error
    ? String(field.error?.message ?? '')
    : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={field.formMessageId}
      role="alert"
      className={mergeClassnames(
        'flex gap-1 items-center text-xs leading-[14px] [&_svg]:text-moon-16 text-red-50',
        className,
      )}
    >
      {body}
    </p>
  );
};

const Description = ({
  className,
  children,
}: WithChildren<{ className?: string }>) => {
  const field = useFormField();

  return (
    <p
      id={field.formDescriptionId}
      className={mergeClassnames(
        'text-xs leading-[14px] text-neutral-60',
        className,
      )}
    >
      {children}
    </p>
  );
};

const Form = Object.assign(FormRoot, {
  Item,
  Field,
  Control,
  Label,
  Message,
  Description,
});

export default Form;
