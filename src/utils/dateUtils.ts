export const toLocaleISO = (dateToConvert: Date) => {
  const offsetMs = dateToConvert.getTimezoneOffset() * 60 * 1000;
  const msLocal = dateToConvert.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  return dateLocal.toISOString();
};

export const formatRelativeTime = (timestamp: number) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const secondsAgo = Math.floor((timestamp - Date.now()) / 1000);

  if (secondsAgo > -60) {
    return rtf.format(secondsAgo, 'second');
  }
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo > -60) {
    return rtf.format(minutesAgo, 'minute');
  }
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo > -24) {
    return rtf.format(hoursAgo, 'hour');
  }
  const daysAgo = Math.floor(hoursAgo / 24);
  return rtf.format(daysAgo, 'day');
};
