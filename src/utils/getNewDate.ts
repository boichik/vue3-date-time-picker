import {
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_SECOND,
} from '../const/time.const';
import { isDate } from './isDate';

export function getNewDate() {
  const now = new Date();

  now.setMilliseconds(0);

  return now;
}

export function getDateWithZeroMilliseconds(value?: Date) {
  if (value && isDate(value)) {
    value.setMilliseconds(0);

    return value;
  }

  return getNewDate();
}

export function getDayStart(date: Date) {
  const newDate = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();

  return +new Date(year, month, newDate);
}

export function getDayEnd(date: Date) {
  return getDayStart(date) + MILLISECONDS_IN_DAY - MILLISECONDS_IN_SECOND;
}
