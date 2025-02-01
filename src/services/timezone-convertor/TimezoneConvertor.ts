import { format, toZonedTime } from 'date-fns-tz';
import type { TimezoneConvertor } from './TimezoneConvertor.interface';
import { parseISO } from 'date-fns';
import { isValidTimeZone } from '@/utils/isValidTimeZone';
import { isDate } from '@/utils/isDate';

const template = 'yyyy-MM-dd HH:mm:ssXXX';

export class TimezoneConvertorImpl implements TimezoneConvertor {
  private get _localTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  convertToTimeZone(date: string | Date, timeZone: string) {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isDate(dateObj)) {
      throw new TypeError('TimezoneConvertor: Invalid Date');
    }

    if (!isValidTimeZone(timeZone)) {
      console.error(`TimezoneConvertor: Invalid timezone "${timeZone}"`);

      return dateObj;
    }
    return toZonedTime(
      format(dateObj, template, { timeZone: this._localTimezone }),
      timeZone
    );
  }

  convertToLocalTime(date: string | Date, currentTimezone?: string): Date {
    const timezone =
      currentTimezone && isValidTimeZone(currentTimezone)
        ? currentTimezone
        : this._localTimezone;

    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isDate(dateObj)) {
      throw new TypeError('TimezoneConvertor: Invalid Date');
    }

    return toZonedTime(
      format(dateObj, template, { timeZone: timezone }),
      this._localTimezone
    );
  }
}
