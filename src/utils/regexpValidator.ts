export function regexpValidator(value: unknown, regexp: RegExp): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }

  return new RegExp(regexp).test(value);
}
