export function isValidTimeZone(tz: unknown) {
  if (typeof tz !== 'string') return false;

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
}
