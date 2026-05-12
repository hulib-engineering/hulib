import { createContext, useContext } from 'react';
import {
  useFormState,
  useFormContext as useRHFContext,
} from 'react-hook-form';

import type {
  FormState,
} from './types';

const FormContext = createContext<FormState>({});
FormContext.displayName = 'FormContext';

const useFormContext = (component: string) => {
  const context = useContext(FormContext);
  if (context === null) {
    throw new Error(`<${component}> is missing root <Form /> component.`);
  }
  return context;
};

const FormFieldContext = createContext<{ name: string } | null>(null);
FormFieldContext.displayName = 'FormFieldContext';

const FormItemIdContext = createContext<{ id: string } | null>(null);
FormItemIdContext.displayName = 'FormItemIdContext';

/** Field + item ids and RHF `getFieldState` (same flow as shadcn/ui form). */
const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemIdContext);

  const { getFieldState } = useRHFContext();
  const formState = useFormState({ name: fieldContext?.name ?? '' });

  const id = itemContext?.id ?? '';

  const baseIds = {
    id,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  };

  if (!fieldContext) {
    return {
      ...baseIds,
      name: '',
      invalid: false,
      isTouched: false,
      isDirty: false,
      error: undefined,
    };
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    ...baseIds,
    name: fieldContext.name,
    ...fieldState,
  };
};

export {
  FormContext,
  useFormContext,
  FormFieldContext,
  FormItemIdContext,
  useFormField,
};
