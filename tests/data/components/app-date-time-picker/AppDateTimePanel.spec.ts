import { mount } from '@vue/test-utils';
import AppDateTimePickerPanel from '@/components/app-date-time-picker/src/components/panel/AppDateTimePanel.vue';
import AppDateTimeControlButton from '@/components/app-date-time-picker/src/components/base/AppDateTimeControlButton.vue';
import { DateTimePickerMode } from '@/components/app-date-time-picker/src/enums/dateTimePickerMode';

const casePressButton: any[] = [
  ['--next-month', 'nextMonth', 1, true],
  ['--next-year', 'nextYear', 1, true],
  ['--prev-month', 'prevMonth', 1, true],
  ['--prev-year', 'prevYear', 1, true],
  ['--next-month', 'nextMonth', 10, false],
  ['--next-year', 'nextYear', 10, true],
  ['--prev-month', 'prevMonth', 10, false],
  ['--prev-year', 'prevYear', 10, true],
];

describe('AppDateTimePickerPanel.vue', () => {
  const currentDate = new Date(2025, 0, 1);
  const defaultProps = {
    value: null,
    currentDate,
    mode: DateTimePickerMode.Day,
  };

  it.each(casePressButton)(
    'Checking the response to button presses: class %p emit %p emitValue %p isTruthy %p',
    async (classValue, emit, emitValue, isTruthy) => {
      const yearMode = emitValue === 10;

      const wrapper = mount(AppDateTimePickerPanel, {
        props: yearMode
          ? {
              ...defaultProps,
              mode: DateTimePickerMode.Year,
            }
          : defaultProps,
      });

      const button = wrapper.find(
        `.app-date-time-picker-panel__button${classValue}`
      );

      expect(button.isVisible()).toBe(isTruthy);

      await button.trigger('click');
      expect(wrapper.emitted(emit)).toStrictEqual([[emitValue]]);
      expect(wrapper.emitted(emit)?.[0]).toEqual([emitValue]);
    }
  );

  it('renders correctly with default props', () => {
    const wrapper = mount(AppDateTimePickerPanel, {
      props: defaultProps,
    });

    expect(wrapper.find('.app-date-time-picker-panel').exists()).toBe(true);
    expect(wrapper.findAllComponents(AppDateTimeControlButton).length).toBe(4);
  });

  it('disables buttons correctly based on isDisabledButtonRelativeDate', () => {
    const wrapper = mount(AppDateTimePickerPanel, {
      props: defaultProps,
      global: {
        provide: {
          AppDateTimePickerComponentDataProvide: {
            value: {
              disabledDate: vi.fn(),
            },
          },
        },
      },
    });

    const buttons = wrapper.findAllComponents(AppDateTimeControlButton);

    expect(buttons[0].props('disabled')).toBe(false); // prevYear
    expect(buttons[1].props('disabled')).toBe(false); // prevMonth
    expect(buttons[2].props('disabled')).toBe(false); // nextMonth
    expect(buttons[3].props('disabled')).toBe(false); // nextYear
  });

  it('emits correct events on button clicks', async () => {
    const wrapper = mount(AppDateTimePickerPanel, {
      props: defaultProps,
    });

    const prevYearButton = wrapper.find(
      '.app-date-time-picker-panel__button--prev-year'
    );
    await prevYearButton.trigger('click');
    expect(wrapper.emitted('prevYear')).toBeTruthy();

    const nextYearButton = wrapper.find(
      '.app-date-time-picker-panel__button--next-year'
    );
    await nextYearButton.trigger('click');
    expect(wrapper.emitted('nextYear')).toBeTruthy();

    const yearModeButton = wrapper.find(
      '.app-date-time-picker-panel__date-button'
    );
    await yearModeButton.trigger('click');
    expect(wrapper.emitted('changeMode')).toBeTruthy();
    expect(wrapper.emitted('changeMode')?.[0]).toEqual([
      DateTimePickerMode.Year,
    ]);
  });

  it('renders year button content correctly', async () => {
    const wrapper = mount(AppDateTimePickerPanel, {
      props: {
        ...defaultProps,
        mode: DateTimePickerMode.Year,
      },
    });

    const buttons = wrapper.findAll('.app-date-time-picker-panel__date-button');

    expect(buttons.length).toBe(2);

    expect(buttons[0].text()).toBe('2020-2029');
    expect(buttons[0].attributes()).toHaveProperty('disabled');

    wrapper.setProps({ mode: 'month' });
  });

  it('hides month elements when mode is Year', async () => {
    const wrapper = mount(AppDateTimePickerPanel, {
      props: {
        ...defaultProps,
        mode: DateTimePickerMode.Year,
      },
    });

    const button = wrapper.find(
      '.app-date-time-picker-panel__date-button--month'
    );

    expect(button.isVisible()).toBe(false);
    expect(button.attributes()).toHaveProperty('disabled');

    await button.trigger('click');

    expect(wrapper.emitted('changeMode')).toBeFalsy();
  });
});
