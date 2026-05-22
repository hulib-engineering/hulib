import { createContext, useContext } from 'react';

import type { FormState } from './types';

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

type FieldStateValue = {
  invalid?: boolean;
  isTouched?: boolean;
  isDirty?: boolean;
  error?: { message?: string; type?: string };
};

const FieldStateContext = createContext<FieldStateValue | null>(null);
FieldStateContext.displayName = 'FieldStateContext';

/**
 * Reads field state exclusively from FieldStateContext (set by Form.Field's
 * Controller render prop). No direct RHF hooks — this keeps the component
 * tree decoupled from FormProvider and follows the dlvn insight pattern.
 */
const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemIdContext);
  const fieldStateFromContext = useContext(FieldStateContext);

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

  return {
    ...baseIds,
    name: fieldContext.name,
    invalid: fieldStateFromContext?.invalid ?? false,
    isTouched: fieldStateFromContext?.isTouched ?? false,
    isDirty: fieldStateFromContext?.isDirty ?? false,
    error: fieldStateFromContext?.error,
  };
};

export {
  FormContext,
  useFormContext,
  FormFieldContext,
  FormItemIdContext,
  FieldStateContext,
  useFormField,
};
