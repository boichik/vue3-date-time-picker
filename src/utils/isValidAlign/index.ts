export function isValidAlign(value: unknown) {
  if (typeof value !== 'string') return false;

  return ['left', 'center', 'right'].includes(value);
}
