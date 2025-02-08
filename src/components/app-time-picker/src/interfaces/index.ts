import type { AppPickerProps } from '@/interfaces';
import type { Ref } from 'vue';

export type AppTimePickerModel = null | Date | (null | Date)[];

export type AppTimePickerAlign = 'left' | 'center' | 'right';

export interface AppTimePickerEnabledTimeTypes {
  hours: boolean;
  minutes: boolean;
  seconds: boolean;
  millisecond: boolean;
  amPm: boolean;
}

export interface AppTimePickerProps extends AppPickerProps {
  /**
   * The value of the picker. (Date, [Date, Date], null, [null, null])
   */
  modelValue?: AppTimePickerModel;
  /**
   * format is for displaying the time in the time input
   */
  format?: string;
  /**
   * The option is responsible for enabling the time range selection mode
   */
  isRange?: boolean;
  /**
   * The option indicates what default time should be set in the picker when it is opened
   * If the “isRange” option is enabled, you must pass the value in the format - [Date, Date].
   * Default: new Date()
   */
  defaultTime?: Date | Date[];
  /**
   * This option is responsible for setting the time selection range.
   * Format “00:00:00 - 23:59:59”
   * If the “isRange” option is enabled, you need to pass an array - ["00:00:00 - 12:30:00", "12:30:00 - 23:59:59"]
   */
  selectableRange?: string | string[];
}

export interface AppTimePickerInternalSettings {
  isDisabledDate?: (value: Date) => boolean;
}

export interface AppTimePickerExpose {
  popoverVisible: Ref<boolean>;
  blur(): void;
  focus(): void;
}

export type AppTimePickerComponentData = Pick<
  AppTimePickerProps,
  | 'readonly'
  | 'disabled'
  | 'clearable'
  | 'placeholder'
  | 'startPlaceholder'
  | 'endPlaceholder'
  | 'isRange'
  | 'format'
  | 'timezone'
> &
  Required<
    Pick<
      AppTimePickerProps,
      | 'readonly'
      | 'disabled'
      | 'clearable'
      | 'isRange'
      | 'format'
      | 'invalid'
      | 'cancelText'
      | 'applyText'
      | 'inputReadonly'
    >
  > & {
    startDefaultTime: Date;
    endDefaultTime: Date;
    disabledApplyButton: boolean;
    selectableRange?: string;
    startSelectableRange?: string;
    endSelectableRange?: string;
    isDisabledDate?: (value: Date) => boolean;
    applyChange: () => void;
    cancelChange: () => void;
  };
