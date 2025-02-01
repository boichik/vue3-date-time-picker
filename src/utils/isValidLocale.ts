export function isValidLocale(locale: unknown) {
  if (typeof locale !== 'string') return false;

  try {
    return !!Intl.DateTimeFormat.supportedLocalesOf(locale).length;
  } catch {
    return false;
  }
}
