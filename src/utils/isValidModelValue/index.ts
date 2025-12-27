import type { AppDateTimePickerModel } from '@/components/app-date-time-picker/src/interfaces/index.interface';

export function isValidModelValue(
  value: unknown,
  options?: { onlySingle?: boolean; onlyRange?: boolean }
): value is AppDateTimePickerModel {
  if (!options?.onlyRange) {
    if (value === null) {
      return true;
    }

    if (value instanceof Date) {
      return !Number.isNaN(value.getTime());
    }
  }

  if (!options?.onlySingle && Array.isArray(value)) {
    return value.every(
      item =>
        item === null || (item instanceof Date && !Number.isNaN(item.getTime()))
    );
  }

  return false;
}
