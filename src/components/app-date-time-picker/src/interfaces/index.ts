import type { AppTimePickerProps } from '@/components/app-time-picker/src/interfaces';
import type { Ref } from 'vue';
import type { AppDateTimePickerType } from '../enums/dateTimePickerType';
import type { AppPickerProps } from '@/interfaces';
import type { ITimezoneConvertor } from '@/services/timezone-convertor/types';
import { AppDateTimePickerMode } from '../enums/dateTimePickerMode';

export type AppDateTimePickerModel = null | Date | (null | Date)[];

export type AppDateTimePickerFirstDayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type AppDateTimePickerWeekdayFormat = 'long' | 'short' | 'narrow';

export type AppDateTimePickerMonthFormat =
  | 'long'
  | 'short'
  | 'narrow'
  | 'numeric'
  | '2-digit';

export type AppDateTimePickerTimeOptions = Pick<
  AppTimePickerProps,
  | 'placeholder'
  | 'startPlaceholder'
  | 'endPlaceholder'
  | 'applyText'
  | 'cancelText'
  | 'nextText'
>;

export interface AppDateTimePickerShortcut {
  text: string;
  value?: AppDateTimePickerModel;
}

export interface AppDateTimePickerExpose {
  popoverVisible: Ref<boolean>;
  blur(): void;
  focus(): void;
}

export interface AppDateTimePickerProps extends AppPickerProps {
  /**
   * The value of the picker. (Date, [Date, Date], null, [null, null])
   */
  modelValue?: AppDateTimePickerModel;
  /**
   * format is designed to display the date in the input data
   */
  dateFormat?: string;
  /**
   * format is for displaying the time in the time input (ie in 'datetime', 'datetimerange' modes)
   */
  timeFormat?: string;
  /**
   * Generate the format for the picker with the “datetime” or “datetimerange” types from the “dateFormat” & “timeFormat” options
   */
  combineFormats?: boolean;
  /**
   * The option indicates which type of picker should be displayed. ('date', 'datetime', 'daterange', 'datetimerange')
   * Default: 'date'
   */
  type?: AppDateTimePickerType;
  /**
   * An option that indicates what type of calendar will be displayed. (day, month, year)
   */
  mode?: AppDateTimePickerMode;
  /**
   * The option is responsible for the order of the days of the week in the day calendar. (1, 2, 3, 4, 5, 6, 7)
   */
  firstDayOfWeek?: AppDateTimePickerFirstDayOfWeek;
  /**
   * The option indicates in what format the names of the days of the week should be displayed in the day calendar. ("long", "short", "narrow")
   */
  weekdayFormat?: AppDateTimePickerWeekdayFormat;
  /**
   * The option specifies in what format to display the names of months in the calendar. ("long", "short", "narrow", "numeric", "2-digit")
   */
  monthCellFormat?: AppDateTimePickerMonthFormat;
  /**
   * The parameter determines in what format the month name is displayed in the panel button. ("long", "short", "narrow", "numeric", "2-digit")
   */
  monthButtonFormat?: AppDateTimePickerMonthFormat;
  /**
   * This option displays a list of shortcuts to quickly select a date.
   * It is an array of objects
   *  {
   *    "text": string;
   *    "value": Date | null | (Date | null)[]
   *  }
   */
  shortcuts?: AppDateTimePickerShortcut[];
  /**
   * The time that will be set by default.
   * The expected format is “00:00:00”
   * For a picker with a “range” type, you must pass an array (example “[‘12:00:00’, ‘13:00:00’]”)
   */
  defaultTime?: string | string[];
  /**
   * The language in which you want to display data in the picker.
   * (Use only if you do not have the “vue-i18n” package)
   */
  locale?: Intl.LocalesArgument;

  /**
   * An option that is responsible for setting up the time picker. ("placeholder", "startPlaceholder", "endPlaceholder")
   */
  timeOptions?: AppDateTimePickerTimeOptions;
  /**
   * Hide days that belong to another month
   */
  hideOffsetDay?: boolean;
  /**
   * The option is used to define blocked dates
   * @param date
   */
  disabledDate?(date: Date): boolean;
}

type SelectedDateClass = 'left' | 'right' | 'center' | boolean;

interface AppDateTimePickerTableComponentData<T extends unknown[] = []> {
  inRange: (date: Date, ...args: T) => boolean;
  isHoverRange: (date: Date, ...args: T) => boolean;
  isSelected: (date: Date, ...args: T) => SelectedDateClass;
  select: (date: Date) => void;
  hover: (date: Date) => void;
  resetHover: () => void;
}

export type AppDateTimePickerGlobalTableComponentData = Pick<
  AppDateTimePickerTableComponentData,
  'select'
>;

export type AppDateTimePickerDayTableComponentData =
  AppDateTimePickerTableComponentData<[isOtherMonth: boolean]>;

export type AppDateTimePickerMonthTableComponentData =
  AppDateTimePickerTableComponentData;

export type AppDateTimePickerYearTableComponentData =
  AppDateTimePickerTableComponentData;

export type AppDateTimePickerComponentData = Pick<
  AppDateTimePickerProps,
  | 'readonly'
  | 'disabled'
  | 'clearable'
  | 'placeholder'
  | 'startPlaceholder'
  | 'endPlaceholder'
  | 'firstDayOfWeek'
  | 'type'
  | 'shortcuts'
  | 'disabledDate'
  | 'timeOptions'
  | 'defaultTime'
  | 'dateFormat'
  | 'timeFormat'
  | 'combineFormats'
  | 'weekdayFormat'
  | 'monthCellFormat'
  | 'monthButtonFormat'
  | 'locale'
  | 'timezone'
  | 'mode'
> &
  Required<
    Pick<
      AppDateTimePickerProps,
      | 'readonly'
      | 'firstDayOfWeek'
      | 'disabled'
      | 'clearable'
      | 'type'
      | 'dateFormat'
      | 'timeFormat'
      | 'combineFormats'
      | 'weekdayFormat'
      | 'monthCellFormat'
      | 'monthButtonFormat'
      | 'locale'
      | 'invalid'
      | 'cancelText'
      | 'applyText'
      | 'inputReadonly'
      | 'mode'
      | 'startId'
      | 'endId'
      | 'startName'
      | 'endName'
      | 'hideOffsetDay'
    >
  > & {
    disabledApplyButton: boolean;
    timezoneConvertor: ITimezoneConvertor;
    today: Date;
    applyChange: () => void;
    cancelChange: () => void;
  };
