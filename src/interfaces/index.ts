export type AppPickerAlign = 'left' | 'center' | 'right';

export interface AppPickerProps {
  /**
   * Picker is blocked
   */
  disabled?: boolean;
  /**
   * The picker is read-only (the popover does not open)
   */
  readonly?: boolean;
  /**
   * Entering a value via inputs is not available
   */
  inputReadonly?: boolean;
  /**
   * Displaying a controller for clearing a data input when it is full
   */
  clearable?: boolean;
  /**
   * the timezone parameter allows you to define the time zone that will be used to correct the time in the picker.
   *
   * How it works:
   *
   * 1. Local time      - If the user is located in the Europe/Kyiv time zone and the date transmitted is 2025-01-27T12:00:00,
   *                      the picker will show this time in the specified time zone.
   *
   * 2. Time correction - If the timezone is America/New_New_York, the picker will calculate the difference between
   *                      Europe/Kyiv and America/New_New_York (for example, -7 hours)
   *                      and display the time with this correction.
   */
  timezone?: string;
  /**
   * The text that will be displayed in the input placeholder when the picker is of one type:
   * 1. Date picker - ('date', datetime')
   * 2. Time picker - props `isRange` = false
   */
  placeholder?: string;
  /**
   * The text that will be displayed in the first input placeholder when the picker is of one type:
   * 1. Date picker - ('daterage', datetimerange')
   * 2. Time picker - props `isRange` = true
   */
  startPlaceholder?: string;
  /**
   * The text that will be displayed in the last input placeholder when the picker is of one type:
   * 1. Date picker - ('daterage', datetimerange')
   * 2. Time picker - props `isRange` = true
   */
  endPlaceholder?: string;
  /**
   * The position of the picker's display. (left, center, right)
   */
  align?: AppPickerAlign;

  /**
   * The text displayed in the cancel button in the picker popover
   */
  cancelText?: string;
  /**
   * The text displayed in the apply button in the picker popover
   */
  applyText?: string;
  /**
   * An option indicating that the picker has an invalid value
   */
  invalid?: boolean;
  /**
   * Delay in milliseconds before the popover opens after being triggered.
   * Default: 0ms.
   */
  openDelay?: number;
  /**
   * Delay in milliseconds before the popover closes after being triggered.
   * Default: 150ms.
   */
  closeDelay?: number;
  /**
   * Determines if the popover content should be appended to the `<body>`
   * instead of being nested within the DOM structure of the component.
   */
  appendToBody?: boolean;
  /**
   * Leave the picker open after opening it. Use it for debugging or researching a popover
   */
  stayOpened?: boolean;
  /**
   * applying changes without clicking the Apply button
   */
  autoApply?: boolean;
}
