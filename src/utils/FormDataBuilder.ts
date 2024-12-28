export default function FormDataBuilder(
  object: Object,
  form?: FormData,
  namespace?: string,
): FormData {
  const formData = form || new FormData();
  Object.keys(object).forEach((property) => {
    const formKey = namespace ? `${namespace}[${property}]` : property;
    if (object[property as keyof Object] instanceof Date) {
      formData.append(formKey, object[property as keyof Object].toString());
    } else if (
      typeof object[property as keyof Object] === 'object' &&
      !(object[property as keyof Object] instanceof File)
    ) {
      FormDataBuilder(object[property as keyof Object], formData, formKey);
    } else {
      // @ts-ignore
      formData.append(formKey, object[property as keyof Object]);
    }
  });
  return formData;
}
