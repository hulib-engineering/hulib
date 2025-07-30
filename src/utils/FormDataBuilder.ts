type FormDataValue = string | number | boolean | Date | File | Record<string, any>;

export default function buildFormData<T extends Record<string, FormDataValue>>(
  data: T,
  formData: FormData = new FormData(),
  parentKey: string = '',
): FormData {
  const isNestedObject = (value: FormDataValue): value is Record<string, FormDataValue> => {
    return typeof value === 'object'
      && value !== null
      && !(value instanceof Date)
      && !(value instanceof File);
  };

  const appendValue = (key: string, value: FormDataValue): void => {
    if (value instanceof Date) {
      formData.append(key, value.toString());
    } else if (isNestedObject(value)) {
      buildFormData(value, formData, key);
    } else {
      formData.append(key, String(value));
    }
  };

  Object.entries(data).forEach(([property, value]) => {
    const formKey = parentKey ? `${parentKey}[${property}]` : property;
    appendValue(formKey, value);
  });

  return formData;
}
