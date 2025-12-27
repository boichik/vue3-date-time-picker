export function isValidTimeZone(tz: unknown) {
  if (typeof tz !== 'string') return false;

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
