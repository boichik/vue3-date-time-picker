import { isDate, isEqual } from 'date-fns';
import { TimezoneConvertor } from '@/services/timezone-convertor';

type Model = null | Date | (Date | null)[];

export function isSameModelValue(
  oldValue: Model,
  newValue: Model,
  timezone?: string
) {
  const timezoneConvertor = new TimezoneConvertor();

  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    if (oldValue.length !== newValue.length) return false;

    const newValueMap = newValue.map(el => {
      if (timezone) {
        return el && isDate(el)
          ? timezoneConvertor.convertToTimeZone(el, timezone)
          : el;
      }

      return el;
    });

    return oldValue.every((date, index) =>
      isSameDateOrNullValue(date, newValueMap[index])
    );
  }

  if (!Array.isArray(oldValue) && !Array.isArray(newValue)) {
    if (timezone && isDate(newValue)) {
      return isSameDateOrNullValue(
        oldValue,
        timezoneConvertor.convertToTimeZone(newValue, timezone)
      );
    }

    return isSameDateOrNullValue(oldValue, newValue);
  }

  return false;
}

export function isSameDateOrNullValue(
  startValue: Date | null | undefined,
  endValue: Date | null | undefined
) {
  if (
    (isDate(startValue) && isDate(endValue) && isEqual(startValue, endValue)) ||
    (!startValue && !endValue)
  ) {
    return true;
  }

  return false;
}
