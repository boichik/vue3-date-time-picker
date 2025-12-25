export function getObject<T>(value: unknown): T {
  if (value && typeof value === 'object') return value as T;

  return {} as T;
}
