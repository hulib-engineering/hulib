export const toLocaleISO = (dateToConvert: Date) => {
  const offsetMs = dateToConvert.getTimezoneOffset() * 60 * 1000;
  const msLocal = dateToConvert.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  return dateLocal.toISOString();
};
