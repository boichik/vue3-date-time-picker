export function isValidModelValue(
  value: unknown,
  options?: { onlySingle?: boolean; onlyRange?: boolean }
) {
  if (!options?.onlyRange) {
    if (value === null) {
      return true;
    }

    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
  }

  if (!options?.onlySingle && Array.isArray(value)) {
    return value.every(
      item => item === null || (item instanceof Date && !isNaN(item.getTime()))
    );
  }

  return false;
}
