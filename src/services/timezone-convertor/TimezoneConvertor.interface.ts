export interface TimezoneConvertor {
  convertToTimeZone(date: string | Date, timeZone: string): Date;
  convertToLocalTime(date: string | Date, currentTimezone?: string): Date;
}
