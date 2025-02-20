import {
  AppDateTimePicker,
  type AppDateTimePickerProps,
} from '@/components/app-date-time-picker';
import AppDateTimeContent from '@/components/app-date-time-picker/src/components/base/AppDateTimeContent.vue';
import AppDateMode from '@/components/app-date-time-picker/src/components/mode/AppDateMode.vue';
import AppDateRangeMode from '@/components/app-date-time-picker/src/components/mode/AppDateRangeMode.vue';
import AppDateTimePanel from '@/components/app-date-time-picker/src/components/panel/AppDateTimePanel.vue';
import AppDateTimeShortcutPanel from '@/components/app-date-time-picker/src/components/panel/AppDateTimeShortcutPanel.vue';
import AppDayTable from '@/components/app-date-time-picker/src/components/table/AppDayTable.vue';
import AppMonthTable from '@/components/app-date-time-picker/src/components/table/AppMonthTable.vue';
import AppYearTable from '@/components/app-date-time-picker/src/components/table/AppYearTable.vue';
import { useLocalization } from '@/composables/useLocalization';
import AppButton from '@/ui/AppButton.vue';
import AppButtonPanel from '@/ui/AppButtonPanel.vue';
import AppPopover from '@/ui/AppPopover.vue';
import { initResizeObserverMock } from '@tests/mocks/ResizeObserverMock';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { isBefore, isAfter } from 'date-fns';
import { millisecondsInDay } from 'date-fns/constants';
import type { Mock } from 'vitest';

vi.mock('@/composables/useLocalization', () => ({
  useLocalization: vi.fn(),
}));

const openPopover = async (wrapper: VueWrapper) => {
  const input = wrapper.find<HTMLInputElement>(
    '.app-datetime-picker-input__inner'
  );

  await input.trigger('focus');

  const popover = wrapper.findComponent(AppPopover);

  await vi.waitUntil(() => popover.emitted('open'), {
    timeout: 200,
    interval: 2,
  });

  return { input, popover };
};

const applyValue = async (wrapper: VueWrapper) => {
  const buttonPanel = wrapper.findComponent(AppButtonPanel);

  expect(buttonPanel.exists()).toBeTruthy();

  const buttons = buttonPanel.findAllComponents(AppButton);

  expect(buttons[1].exists()).toBeTruthy();

  await buttons[1].trigger('click');
};

const firstDayWeekdaysEqualsTo = (wrapper: VueWrapper, value: string) => {
  const weekday = wrapper
    .findComponent(AppDayTable)
    .find('.app-date-time-picker-day-table__weekdays')
    .find('.app-date-time-picker-day-table__cell-content');

  expect(weekday.text()).toBe(value);
};

const findAllCellNotOtherMonth = (wrapper: VueWrapper, index = 0) => {
  const dayTables = wrapper.findAllComponents(AppDayTable);
  expect(dayTables[index].exists()).toBe(true);

  const cells = dayTables[index]
    .find('tbody')
    .findAll('.app-date-time-picker-day-table__cell')
    .filter(
      el => !el.classes('app-date-time-picker-day-table__cell--other-month')
    );

  expect(cells.length).toBeTruthy();

  return { cells };
};

const wrapperEmittedValue = (wrapper: VueWrapper, value: any) => {
  expect(wrapper.emitted('update:model-value')).toBeTruthy();
  expect(wrapper.emitted('update:model-value')![0][0]).toStrictEqual(value);
};

describe('AppDateTimePicker', () => {
  initResizeObserverMock();

  const mockErrorHandler = vi.fn();
  const mockDate = new Date(2025, 0, 1);

  vi.useFakeTimers().setSystemTime(mockDate);

  const createWrapper = (props: AppDateTimePickerProps = {}, slots = {}) =>
    mount(AppDateTimePicker, {
      props: {
        ...props,
        appendToBody: true,
      },
      slots,
      global: {
        config: {
          errorHandler: mockErrorHandler,
        },
      },
    });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be rendered with an input', () => {
    const wrapper = createWrapper();

    const input = wrapper.find('.app-datetime-picker-input');

    expect(input.isVisible()).toBeTruthy();
  });

  it('should be rendered in readonly mode', () => {
    const wrapper = createWrapper({ readonly: true });

    const input = wrapper.find('.app-datetime-picker-input--read-only');

    expect(input.isVisible()).toBeTruthy();
  });

  it('should use the default value readonly', () => {
    const wrapper = createWrapper({ readonly: 'true' });

    const input = wrapper.find('.app-datetime-picker-input__inner');

    expect(input.attributes('readonly')).toBeFalsy();
  });

  it('should be rendered in disabled mode', () => {
    const wrapper = createWrapper({ disabled: true });

    const input = wrapper.find('.app-datetime-picker-input--disabled');

    expect(input.isVisible()).toBeTruthy();
  });

  it('should use the default value disabled', () => {
    const wrapper = createWrapper({ disabled: 'true' });

    const input = wrapper.find('.app-datetime-picker-input__inner');

    expect(input.attributes('disabled')).toBeFalsy();
  });

  it('should display an invalid input', () => {
    const wrapper = createWrapper({ invalid: true });

    const input = wrapper.find('.app-datetime-picker-input--invalid');

    expect(input.isVisible()).toBeTruthy();
  });

  it('should use the invalid value for invalid props', () => {
    const wrapper = createWrapper({ invalid: 'true' });

    const input = wrapper.element.querySelector(
      '.app-datetime-picker-input--invalid'
    );

    expect(input).toBeNull();
  });

  it('must be displayed by the placeholder', () => {
    const placeholder = 'Start';
    const wrapper = createWrapper({ placeholder: placeholder });

    const input = wrapper.find('input');

    expect(input.attributes('placeholder')).toBe(placeholder);
  });

  it('should display an init with an empty placeholder', () => {
    const startPlaceholder = 'Start';
    const endPlaceholder = 'End';
    const wrapper = createWrapper({ startPlaceholder, endPlaceholder });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('placeholder')).toBe('');
  });

  it('must display the placeholders for the initial instalment and the final instalment', () => {
    const startPlaceholder = 'Start';
    const endPlaceholder = 'End';
    const wrapper = createWrapper({
      type: 'daterange',
      startPlaceholder,
      endPlaceholder,
    });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('placeholder')).toBe(startPlaceholder);
    expect(inputs[1].attributes('placeholder')).toBe(endPlaceholder);
  });

  it('should emits the date after the sabbatical of the selected date', async () => {
    const wrapper = createWrapper();

    const { input } = await openPopover(wrapper);

    const { cells } = findAllCellNotOtherMonth(wrapper);

    const cell = cells[0];

    expect(Number(cell.text())).toBe(1);

    await cell.trigger('click');

    expect(
      cell.classes('app-date-time-picker-day-table__cell--selected')
    ).toBeTruthy();

    expect(input.element.value).toBe('2025/01/01');

    await applyValue(wrapper);
    wrapperEmittedValue(wrapper, new Date(2025, 0, 1));
  });

  it('should display the correct date according to the format', () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1),
      dateFormat: 'dd/MM/yyyy',
    });

    const input = wrapper.find('.app-datetime-picker-input__inner');

    expect((input.element as HTMLInputElement).value).toBe('01/01/2025');
  });

  it('display the correct date in accordance with the date + time format', () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1, 12),
      dateFormat: 'dd/MM/yyyy',
      timeFormat: 'HH-mm-ss',
      type: 'datetime',
    });

    const input = wrapper.find('.app-datetime-picker-input__inner');

    expect((input.element as HTMLInputElement).value).toBe(
      '01/01/2025 12-00-00'
    );
  });

  it('should clear the value of', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1),
      clearable: true,
    });

    const button = wrapper.find('.app-datetime-picker-input__clear');

    await button.trigger('click');
    wrapperEmittedValue(wrapper, null);
  });

  it('should use the default value clearable', () => {
    const wrapper = createWrapper({ clearable: 'true' });

    const button = wrapper.element.querySelector(
      '.app-datetime-picker-input__clear'
    );
    expect(button).toBeNull();
  });

  const displayPickerModeTestCase: any[] = [
    ['date', AppDateMode],
    ['datetime', AppDateMode],
    ['daterange', AppDateRangeMode],
    ['datetimerange', AppDateRangeMode],
    ['test', AppDateMode],
    [1, AppDateMode],
    [null, AppDateMode],
    [undefined, AppDateMode],
  ];

  it.each(displayPickerModeTestCase)(
    'should display the picker in the: mode= %p; component: %p',
    async (type, component) => {
      const wrapper = createWrapper({
        type,
      });

      await openPopover(wrapper);

      expect(wrapper.findComponent(component).exists()).toBeTruthy();
    }
  );

  const alignPopoverTestCase: any[] = [
    [null, 'bottom-start'],
    [undefined, 'bottom-start'],
    [1, 'bottom-start'],
    ['test', 'bottom-start'],
    [[], 'bottom-start'],
    [{}, 'bottom-start'],
    [true, 'bottom-start'],
    [false, 'bottom-start'],
    ['left', 'bottom-start'],
    ['center', 'bottom'],
    ['right', 'bottom-end'],
  ];

  it.each(alignPopoverTestCase)(
    'should display a picker with the position: align= %p; placement: %p',
    async (align, placement) => {
      const wrapper = createWrapper({
        align,
      });

      expect(wrapper.findComponent(AppPopover).props('placement')).toBe(
        placement
      );
    }
  );

  it('should display the first day of the week', async () => {
    const wrapper = createWrapper({
      firstDayOfWeek: 7,
    });

    await openPopover(wrapper);
    firstDayWeekdaysEqualsTo(wrapper, 'Sun');
  });

  it('should display the first day of the week with an incorrect value', async () => {
    const wrapper = createWrapper({
      firstDayOfWeek: 12,
    });

    await openPopover(wrapper);

    firstDayWeekdaysEqualsTo(wrapper, 'Mon');
  });

  it('should display the text in Ukrainian', async () => {
    const wrapper = createWrapper({
      locale: 'uk',
    });

    await openPopover(wrapper);

    firstDayWeekdaysEqualsTo(wrapper, 'пн');
  });

  it('should display the name of the week relative to the locale selected in i18n', async () => {
    (useLocalization as Mock).mockReturnValue({
      locale: {
        value: 'uk',
      },
    });

    const wrapper = createWrapper();

    await openPopover(wrapper);

    firstDayWeekdaysEqualsTo(wrapper, 'пн');

    (useLocalization as Mock).mockReturnValue(undefined);
  });

  it('an error should occur when passing an incorrect locale', async () => {
    const wrapper = createWrapper({
      locale: 'incorrect',
    });

    await openPopover(wrapper);

    firstDayWeekdaysEqualsTo(wrapper, 'Mon');
  });

  it('the name of the day of the week must be formatted correctly', async () => {
    const wrapper = createWrapper({
      weekdayFormat: 'long',
    });

    await openPopover(wrapper);
    firstDayWeekdaysEqualsTo(wrapper, 'Monday');
  });

  it('the name of the week should be correctly formatted with an incorrect value passed', async () => {
    const wrapper = createWrapper({
      weekdayFormat: 'incorrect',
    });

    await openPopover(wrapper);

    firstDayWeekdaysEqualsTo(wrapper, 'Mon');
  });

  it('should use the default value of combineFormats', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1, 12, 30, 30),
      combineFormats: 'true',
    });

    expect(wrapper.find('input').element.value).toBe('2025/01/01');
  });

  it('the name of the mount in cell must be formatted correctly', async () => {
    const wrapper = createWrapper({
      monthCellFormat: 'long',
    });

    await openPopover(wrapper);

    const month = wrapper
      .findComponent(AppMonthTable)
      .find('.app-date-time-picker-month-table__cell-content');

    expect(month.text()).toBe('January');
  });

  it('the month name should be correctly formatted when an invalid value is passed', async () => {
    const wrapper = createWrapper({
      monthCellFormat: 'incorrect',
    });

    await openPopover(wrapper);

    const month = wrapper
      .findComponent(AppMonthTable)
      .find('.app-date-time-picker-month-table__cell-content');

    expect(month.text()).toBe('Jan');
  });

  it('the month name in the button should be formatted correctly', async () => {
    const wrapper = createWrapper({
      monthButtonFormat: 'short',
    });

    await openPopover(wrapper);

    const button = wrapper
      .findComponent(AppDateTimePanel)
      .find('.app-date-time-picker-panel__date-button--month');

    expect(button.text()).toBe('Jan');
  });

  it('the month name in the button with an incorrect value should be formatted correctly', async () => {
    const wrapper = createWrapper({
      monthButtonFormat: 'inccorect',
    });

    await openPopover(wrapper);

    const button = wrapper
      .findComponent(AppDateTimePanel)
      .find('.app-date-time-picker-panel__date-button--month');

    expect(button.text()).toBe('January');
  });

  it('a date must be selected through the shortlist', async () => {
    const data = {
      text: 'Test',
      value: new Date(2025, 0, 1),
    };

    const wrapper = createWrapper({
      shortcuts: [data],
    });

    const { input } = await openPopover(wrapper);

    const shortcut = wrapper
      .findComponent(AppDateTimeShortcutPanel)
      .find('.app-date-time-shortcut-panel__list-item');

    expect(shortcut.text()).toBe(data.text);

    await shortcut.trigger('click');

    expect(input.element.value).toBe('2025/01/01');
  });

  it('should emits a date with a default time', async () => {
    const wrapper = createWrapper({
      defaultTime: '12:32:15',
    });

    await openPopover(wrapper);

    const dayTable = wrapper.findComponent(AppDayTable);
    expect(dayTable.exists()).toBe(true);

    const { cells } = findAllCellNotOtherMonth(wrapper);

    const cell = cells[0];

    expect(Number(cell.text())).toBe(1);

    await cell.trigger('click');

    await applyValue(wrapper);
    wrapperEmittedValue(wrapper, new Date(2025, 0, 1, 12, 32, 15));
  });

  it('should emits a date range with a default time', async () => {
    const wrapper = createWrapper({
      defaultTime: ['12:32:15', '18:30:20'],
      type: 'daterange',
    });

    await openPopover(wrapper);

    const { cells } = findAllCellNotOtherMonth(wrapper);

    const cell = cells[0];

    expect(Number(cell.text())).toBe(1);

    await cell.trigger('click');

    await flushPromises();

    await cell.trigger('click');

    await applyValue(wrapper);
    wrapperEmittedValue(wrapper, [
      new Date(2025, 0, 1, 12, 32, 15),
      new Date(2025, 0, 1, 18, 30, 20),
    ]);
  });

  it('must give the date that was in the time zone', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 2),
      type: 'datetime',
      timezone: 'America/New_York',
    });

    expect(wrapper.find('input').element.value).toBe('2025/01/01 17:00:00');

    await openPopover(wrapper);

    const { cells } = findAllCellNotOtherMonth(wrapper);

    const currentSelectedCell = cells.find(el =>
      el.classes('app-date-time-picker-day-table__cell--selected')
    );

    expect(Number(currentSelectedCell!.text())).toBe(1);

    const newCell = cells[5];

    expect(Number(newCell.text())).toBe(6);

    await newCell.trigger('click');

    await applyValue(wrapper);
    wrapperEmittedValue(wrapper, new Date(2025, 0, 7, 0, 0, 0));
  });

  it('should display the date in the current time zone with an incorrect time zone parameter', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 2),
      type: 'datetime',
      timezone: 'America',
    });

    expect(wrapper.find('input').element.value).toBe('2025/01/02 00:00:00');
  });

  it('should display the text on the sabbatical and cancel button', async () => {
    const applyText = 'TEST1';
    const cancelText = 'TEST2';

    const wrapper = createWrapper({
      applyText,
      cancelText,
    });

    await openPopover(wrapper);

    const panel = wrapper.findComponent(AppButtonPanel);

    const buttons = panel.findAll('button');

    expect(buttons[0].text()).toBe(cancelText);
    expect(buttons[1].text()).toBe(applyText);
  });

  it('should display the default text on the sabbatical and cancel button', async () => {
    const applyText = 123;
    const cancelText = [];

    const wrapper = createWrapper({
      applyText,
      cancelText,
    });

    await openPopover(wrapper);

    const panel = wrapper.findComponent(AppButtonPanel);

    const buttons = panel.findAll('button');

    expect(buttons[0].text()).toBe('Cancel');
    expect(buttons[1].text()).toBe('Apply');
  });

  it('must pass valid settings for AppTimePicker instance', async () => {
    const placeholder = 'TEST1';

    const wrapper = createWrapper({
      type: 'datetime',
      timeOptions: {
        placeholder: placeholder,
      },
    });

    await openPopover(wrapper);

    const mode = wrapper.findComponent(AppDateMode);

    expect(mode.find('input').attributes('placeholder')).toBe(placeholder);
  });

  it('must not pass invalid settings for the AppTimePicker instance', async () => {
    const wrapper = createWrapper({
      type: 'datetime',
      timeOptions: true,
    });

    await openPopover(wrapper);

    const mode = wrapper.findComponent(AppDateMode);

    expect(mode.find('input').attributes('placeholder')).toBeUndefined();
  });

  it('must pass valid settings for two AppTimePicker instances', async () => {
    const startPlaceholder = 'Start';
    const endPlaceholder = 'End';

    const wrapper = createWrapper({
      type: 'datetimerange',
      timeOptions: {
        startPlaceholder,
        endPlaceholder,
      },
    });

    await openPopover(wrapper);

    const mode = wrapper.findComponent(AppDateRangeMode);

    expect(mode.findAll('input')[0].attributes('placeholder')).toBe(
      startPlaceholder
    );
    expect(mode.findAll('input')[1].attributes('placeholder')).toBe(
      endPlaceholder
    );
  });

  it('must have inaccessible cells', async () => {
    const disabledDate = (date: Date) => {
      const cutoffDate = new Date(2025, 0, 10);
      return (
        isBefore(date, +cutoffDate - millisecondsInDay * 5) ||
        isAfter(date, +cutoffDate + millisecondsInDay * 5)
      );
    };

    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 10),
      disabledDate,
    });

    await openPopover(wrapper);

    const { cells } = findAllCellNotOtherMonth(wrapper);

    expect(cells[3].text()).toBe('4');
    expect(
      cells[3].classes('app-date-time-picker-day-table__cell--disabled')
    ).toBeTruthy();

    expect(cells[4].text()).toBe('5');
    expect(
      cells[4].classes('app-date-time-picker-day-table__cell--disabled')
    ).toBeFalsy();

    expect(cells[15].text()).toBe('16');
    expect(
      cells[15].classes('app-date-time-picker-day-table__cell--disabled')
    ).toBeTruthy();

    expect(cells[14].text()).toBe('15');
    expect(
      cells[14].classes('app-date-time-picker-day-table__cell--disabled')
    ).toBeFalsy();

    await cells[4].trigger('click');

    await applyValue(wrapper);
    wrapperEmittedValue(wrapper, new Date(2025, 0, 5));
  });

  it('must have inaccessible cells using a time zone', async () => {
    const disabledDate = (date: Date) => {
      const cutoffDate = new Date(2025, 0, 10);
      return (
        isBefore(date, +cutoffDate - millisecondsInDay * 5) ||
        isAfter(date, +cutoffDate + millisecondsInDay * 5)
      );
    };

    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 10),
      timezone: 'America/New_York',
      disabledDate,
    });

    await openPopover(wrapper);

    const { cells } = findAllCellNotOtherMonth(wrapper);

    expect(cells[3].text()).toBe('4');
    expect(
      cells[3].classes('app-date-time-picker-day-table__cell--disabled')
    ).toBeTruthy();

    expect(cells[4].text()).toBe('5');
    expect(
      cells[4].classes('app-date-time-picker-day-table__cell--disabled')
    ).toBeFalsy();

    expect(cells[15].text()).toBe('16');
    expect(
      cells[15].classes('app-date-time-picker-day-table__cell--disabled')
    ).toBeTruthy();

    expect(cells[14].text()).toBe('15');
    expect(
      cells[14].classes('app-date-time-picker-day-table__cell--disabled')
    ).toBeFalsy();

    await cells[4].trigger('click');

    await applyValue(wrapper);
    wrapperEmittedValue(wrapper, new Date(2025, 0, 5, 7));
  });

  it('the picker after opening should always be open', async () => {
    const wrapper = createWrapper({ stayOpened: true });

    await openPopover(wrapper);

    const buttonPanel = wrapper.findComponent(AppButtonPanel);

    expect(buttonPanel.exists()).toBeTruthy();

    const buttons = buttonPanel.findAllComponents(AppButton);

    expect(buttons[0].exists()).toBeTruthy();

    await buttons[0].trigger('click');

    expect(wrapper.findComponent(AppPopover).props('modelValue')).toBeTruthy();
  });

  it('the picker after opening should always be open 2', async () => {
    const wrapper = createWrapper({ stayOpened: true });

    const { popover } = await openPopover(wrapper);

    await popover.vm.$emit('close');

    await flushPromises();

    expect(popover.props('modelValue')).toBeFalsy();
    expect(
      wrapper.element.querySelector('.app-date-time-picker-content')
    ).toBeNull();
  });

  it('the picker after opening should always be open 3', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({ modelValue: new Date(2025, 0, 1) });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('2025/01/01');
  });

  it('should react to a change in the modelValue value on the same date', async () => {
    const wrapper = createWrapper({ modelValue: new Date(2025, 0, 1) });

    await wrapper.setProps({ modelValue: new Date(2025, 0, 1) });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('2025/01/01');
  });

  it('should react to a change in the modelValue value when an invalid value is received', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({ modelValue: 'incorrect' });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('');
  });

  it('should react to a change in the modelValue value when the date array arrives', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      modelValue: [new Date(2025, 0, 1), new Date(2025, 0, 5)],
    });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('2025/01/01');
  });

  it('should react to a change in the modelValue value when an array of invalid values is received', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({ modelValue: ['2025', '2024'] });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('');
  });

  it('should display the date relative to the timezone after changing the modelValue', async () => {
    const wrapper = createWrapper({
      type: 'datetime',
      timezone: 'America/New_York',
    });

    await wrapper.setProps({ modelValue: new Date(2025, 0, 1) });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('2024/12/31 17:00:00');
  });

  it('should display the date relative to the timezone after changing the modelValue 2', async () => {
    const wrapper = createWrapper({
      type: 'datetimerange',
      timezone: 'America/New_York',
    });

    await wrapper.setProps({
      modelValue: [new Date(2025, 0, 1), new Date(2025, 0, 1)],
    });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].element.value).toBe('2024/12/31 17:00:00');
    expect(inputs[1].element.value).toBe('2024/12/31 17:00:00');
  });

  it('should display the date relative to the change of the type value to a range', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1),
    });

    await wrapper.setProps({ type: 'daterange' });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].element.value).toBe('2025/01/01');
    expect(inputs[1].element.value).toBe('');
  });

  it('should display the date relative to the change of the range type value when modelValue was empty', async () => {
    const wrapper = createWrapper({
      modelValue: null,
    });

    await wrapper.setProps({ type: 'daterange' });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].element.value).toBe('');
    expect(inputs[1].element.value).toBe('');
  });

  it('should display the date relative to the change of the type value to the date and time', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1),
    });

    await wrapper.setProps({ type: 'datetime' });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('2025/01/01');
  });

  it('should emits the date after the sabbatical of the selected date 2', async () => {
    const wrapper = createWrapper({ modelValue: new Date(2025, 0, 17) });

    const { input } = await openPopover(wrapper);

    const { cells } = findAllCellNotOtherMonth(wrapper);

    const cell = cells[0];

    expect(Number(cell.text())).toBe(1);

    await cell.trigger('click');

    expect(
      cell.classes('app-date-time-picker-day-table__cell--selected')
    ).toBeTruthy();

    expect(input.element.value).toBe('2025/01/01');

    const buttonPanel = wrapper.findComponent(AppButtonPanel);

    expect(buttonPanel.exists()).toBeTruthy();

    const buttons = buttonPanel.findAllComponents(AppButton);

    expect(buttons[0].exists()).toBeTruthy();

    await buttons[0].trigger('click');

    expect(wrapper.find('input').element.value).toBe('2025/01/17');
  });

  it('should display the popover after the focus is called', async () => {
    const wrapper = createWrapper();

    wrapper.vm.focus();
    await wrapper.find('input').trigger('focus');

    const popover = wrapper.findComponent(AppPopover);

    await vi.waitUntil(() => popover.emitted('open'), {
      timeout: 200,
      interval: 2,
    });

    expect(wrapper.findComponent(AppDateTimeContent).exists()).toBeTruthy();
  });

  it('should close the popover after the blur method was called', async () => {
    const wrapper = createWrapper();

    const { input } = await openPopover(wrapper);

    wrapper.vm.blur();
    await input.trigger('blur');

    expect(wrapper.findComponent(AppPopover).props('modelValue')).toBeFalsy();
  });

  it('must close the popover after pressing the cancel key', async () => {
    const wrapper = createWrapper();

    await openPopover(wrapper);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    document.dispatchEvent(event);

    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('must close the popover after pressing the cancel key 2', async () => {
    const wrapper = createWrapper({ modelValue: new Date(2025, 0, 1) });

    await openPopover(wrapper);

    const { cells } = findAllCellNotOtherMonth(wrapper);

    await cells[5].trigger('click');

    const event = new KeyboardEvent('keydown', { key: 'Enter' });

    document.dispatchEvent(event);
    wrapperEmittedValue(wrapper, new Date(2025, 0, 6));

    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('should not close the popover when the same date is selected and the enter key is pressed', async () => {
    const wrapper = createWrapper({ modelValue: new Date(2025, 0, 1) });

    await openPopover(wrapper);

    const event = new KeyboardEvent('keydown', { key: 'Enter' });

    document.dispatchEvent(event);

    expect(wrapper.emitted('update:model-value')).toBeFalsy();
    expect(wrapper.emitted('blur')).toBeFalsy();
  });

  it('must close the picker when the blur event has taken place', async () => {
    const wrapper = createWrapper();

    await openPopover(wrapper);

    const event = new Event('blur');

    window.dispatchEvent(event);

    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('should not close the picker when the blur event has occurred, but the prop stayOpened = true', async () => {
    const wrapper = createWrapper({ stayOpened: true });

    await openPopover(wrapper);

    const event = new Event('blur');

    window.dispatchEvent(event);

    expect(wrapper.emitted('blur')).toBeFalsy();
  });

  it('must close the picker when focusing on an element that is not in the picker', async () => {
    const targetElement = document.createElement('div');
    targetElement.className = 'test-target';
    document.body.appendChild(targetElement);

    const wrapper = createWrapper();

    await openPopover(wrapper);

    const focusinEvent = new Event('focusin', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(focusinEvent, 'target', {
      value: targetElement,
      writable: false,
    });

    window.dispatchEvent(focusinEvent);

    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('should close the picker when focus has occurred on an element that has the ignored attribute', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1),
      clearable: true,
    });
    await openPopover(wrapper);

    const button = wrapper.element
      .querySelector('.app-datetime-picker-input__clear')
      .focus();
    const focusinEvent = new Event('focusin', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(focusinEvent, 'target', {
      value: button,
      writable: false,
    });

    window.dispatchEvent(focusinEvent);

    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('the input must have a readonly attribute, but the floor must open', async () => {
    const wrapper = createWrapper({ inputReadonly: true });

    const { popover, input } = await openPopover(wrapper);

    expect(input.element.readOnly).toBeTruthy();
    expect(popover.props('modelValue')).toBeTruthy();
  });

  it('should pass the correct attributes to the default slot', async () => {
    const wrapper = createWrapper(
      { modelValue: new Date(2025, 0, 1) },
      {
        default: `
        <template #default="{ value, popoverVisible, input, focus, blur }">
          <div class="default-slot-content">
            <span class="value">{{ value }}</span>
            <span class="popover-visible">{{ popoverVisible }}</span>
            <button class="focus-button" @click="focus">Focus</button>
            <button class="blur-button" @click="blur">Blur</button>
          </div>
        </template>
      `,
      }
    );

    const defaultSlotContent = wrapper.find('.default-slot-content');
    expect(defaultSlotContent.exists()).toBeTruthy();

    const valueSpan = defaultSlotContent.find('.value');
    const popoverVisibleSpan = defaultSlotContent.find('.popover-visible');
    const focusButton = defaultSlotContent.find('.focus-button');
    const blurButton = defaultSlotContent.find('.blur-button');

    expect(valueSpan.text()).toBe(mockDate.toString());
    expect(popoverVisibleSpan.text()).toBe('false');

    await focusButton.trigger('click');
    expect(wrapper.vm.popoverVisible).toBe(true);

    await blurButton.trigger('click');
    expect(wrapper.vm.popoverVisible).toBe(false);
  });

  it('should set a new picker value through the default slot', async () => {
    const wrapper = createWrapper(
      {},
      {
        default: `
      <template #default="{ value, input, focus  }">
        <div class="default-slot-content">
          <input :value="value" @input="(event) => input(new Date(event.target.value))" @focus="focus" />
        </div>
      </template>
    `,
      }
    );

    const input = wrapper.find('input');

    expect(input.element.value).toBe('');

    await input.setValue(new Date(2025, 0, 5));

    expect(input.element.value).toBe(new Date(2025, 0, 5).toString());

    await input.trigger('focus');

    const popover = wrapper.findComponent(AppPopover);

    await vi.waitUntil(() => popover.emitted('open'), {
      timeout: 200,
      interval: 2,
    });

    const { cells } = await findAllCellNotOtherMonth(wrapper);

    const cell = cells[4];
    expect(Number(cell.text())).toBe(5);
    expect(
      cell.classes('app-date-time-picker-day-table__cell--selected')
    ).toBeTruthy();
  });

  it('should not override the new value received from the default slot, as it is not valid', async () => {
    const wrapper = createWrapper(
      {},
      {
        default: `
      <template #default="{ value, input, focus  }">
        <div class="default-slot-content">
          <input :value="value" @input="(event) => input(event.target.value)" @focus="focus" />
        </div>
      </template>
    `,
      }
    );

    const input = wrapper.find('input');

    expect(input.element.value).toBe('');

    await input.setValue(new Date(2025, 0, 5));

    expect(input.element.value).toBe(new Date(2025, 0, 5).toString());

    await input.trigger('focus');

    const popover = wrapper.findComponent(AppPopover);

    await vi.waitUntil(() => popover.emitted('open'), {
      timeout: 200,
      interval: 2,
    });

    const { cells } = await findAllCellNotOtherMonth(wrapper);

    const cell = cells[4];
    expect(Number(cell.text())).toBe(5);
    expect(
      cell.classes('app-date-time-picker-day-table__cell--selected')
    ).toBeFalsy();
  });

  it('should display a calendar of days when prop ‘mode’ = ‘day’', async () => {
    const wrapper = createWrapper({ mode: 'day' });

    await openPopover(wrapper);

    const table = wrapper.findComponent(AppDayTable);

    expect(table.isVisible()).toBeTruthy();
  });

  it('should display a calendar of months when prop ‘mode’ = ‘month’', async () => {
    const wrapper = createWrapper({ mode: 'month' });

    await openPopover(wrapper);

    const table = wrapper.findComponent(AppMonthTable);

    expect(table.isVisible()).toBeTruthy();
  });

  it('should display a calendar of years when prop ‘mode’ = ‘year’', async () => {
    const wrapper = createWrapper({ mode: 'year' });

    await openPopover(wrapper);

    const table = wrapper.findComponent(AppYearTable);

    expect(table.isVisible()).toBeTruthy();
  });

  it('should display the date with the selected month after confirming the selection when prop ‘mode’ = ‘month’', async () => {
    const wrapper = createWrapper({ mode: 'month' });

    await openPopover(wrapper);

    const table = wrapper.findComponent(AppMonthTable);

    const cell = table.find('td');

    await cell.trigger('click');

    await applyValue(wrapper);

    wrapperEmittedValue(wrapper, new Date(2025, 0, 1));
  });

  it('must display the date with the selected year after confirming the selection when prop ‘mode’ = ‘year’', async () => {
    const wrapper = createWrapper({ mode: 'year' });

    await openPopover(wrapper);

    const table = wrapper.findComponent(AppYearTable);

    const cell = table.find('td');

    await cell.trigger('click');

    await applyValue(wrapper);

    wrapperEmittedValue(wrapper, new Date(2020, 0, 1));
  });

  it('should give a date range with the selected months after confirming the selection when prop ‘mode’ = ‘month’', async () => {
    const wrapper = createWrapper({ mode: 'month', type: 'daterange' });

    await openPopover(wrapper);

    const [t1, t2] = wrapper.findAllComponents(AppMonthTable);

    const c1 = t1.find('td');

    await c1.trigger('click');

    const c2 = t2.find('td');
    await c2.trigger('click');

    await applyValue(wrapper);

    wrapperEmittedValue(wrapper, [new Date(2025, 0, 1), new Date(2026, 0, 1)]);
  });

  it('should provide a date range with the selected years after confirming the selection when prop ‘mode’ = ‘year’', async () => {
    const wrapper = createWrapper({ mode: 'year', type: 'daterange' });

    await openPopover(wrapper);

    const [t1, t2] = wrapper.findAllComponents(AppYearTable);

    const c1 = t1.find('td');

    await c1.trigger('click');

    const c2 = t2.find('td');
    await c2.trigger('click');

    await applyValue(wrapper);

    wrapperEmittedValue(wrapper, [new Date(2020, 0, 1), new Date(2030, 0, 1)]);
  });
});
