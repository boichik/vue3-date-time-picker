import { getDateWithZeroMilliseconds, getNewDate } from '@/utils/getNewDate';
import { regexpValidator } from '@/utils/regexpValidator';
import { isBefore, isAfter, parse, format } from 'date-fns';
import type { AppTimePickerEnabledTimeTypes } from '../interfaces/index.interface';
import { InputBlockType } from '@/enums/InputBlockType';
import { isDate } from '@/utils/isDate';

export function isValidSelectableRange(value: unknown) {
  const regex =
    /^(2[0-3]|[01]\d):([0-5]\d):([0-5]\d)\s-\s(2[0-3]|[01]\d):([0-5]\d):([0-5]\d)$/;

  return regexpValidator(value, regex);
}

export function parseSelectableRange(selectableRange?: string, date?: Date) {
  let value = selectableRange || '';

  if (typeof value !== 'string') {
    value = `${value}`;
  }

  const referenceDate = isDate(date) ? date : getNewDate();

  const [startTime, endTime] = value
    .trim()
    .split('-')
    .map(time => parse(time.trim(), 'HH:mm:ss', referenceDate));

  return {
    startTime: isDate(startTime) ? startTime : null,
    endTime: isDate(endTime) ? endTime : null,
  };
}

export function leadToValidDateRelativeToRange(
  date: Date,
  selectableRange: { startTime?: Date | null; endTime?: Date | null }
): Date {
  const { startTime, endTime } = selectableRange || {};

  if (!startTime || !endTime || !isDate(startTime) || !isDate(endTime)) {
    return date;
  }

  if (isBefore(getDateWithZeroMilliseconds(date), startTime)) {
    return startTime;
  } else if (isAfter(getDateWithZeroMilliseconds(date), endTime)) {
    return endTime;
  }
  return date;
}

export function convertDateToTime(value: unknown) {
  if (!isDate(value)) {
    return undefined;
  }

  return format(value, 'HH:mm:ss');
}

export function getEnabledTimeTypes(
  format: unknown
): AppTimePickerEnabledTimeTypes {
  const hasType = (array: InputBlockType[]) => {
    let has = false;

    array.forEach(el => {
      if (typeof format === 'string' && format.includes(el)) {
        has = true;
      }
    });

    return has;
  };

  return {
    hours: hasType([
      InputBlockType.Hour,
      InputBlockType.SimpleHour,
      InputBlockType.MilitaryHour,
      InputBlockType.SimpleMilitaryHour,
    ]),
    minutes: hasType([InputBlockType.Minute, InputBlockType.SimpleMinute]),
    seconds: hasType([InputBlockType.Second, InputBlockType.SimpleSecond]),
    millisecond: hasType([InputBlockType.Millisecond]),
    amPm: hasType([InputBlockType.AmPmLower, InputBlockType.AmPmUpper]),
  };
}
