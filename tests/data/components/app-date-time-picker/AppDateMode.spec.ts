import AppDateMode from '@/components/app-date-time-picker/src/components/mode/AppDateMode.vue';
import AppDateTimeController from '@/components/app-date-time-picker/src/components/controller/AppDateTimeController.vue';
import { AppDateTimePickerComponentDataProvide } from '@/components/app-date-time-picker/src/const';
import { mount } from '@vue/test-utils';
import { setTime } from '@/components/app-date-time-picker/src/utils';
import AppDayTable from '@/components/app-date-time-picker/src/components/table/AppDayTable.vue';
import { fakeTimeWrapper } from '@tests/mocks/utils';

describe('AppDateMode', () => {
  const mockDate = new Date(2025, 0, 1);
  const mockDefaultTime = { hours: 12, minutes: 0 };

  const mockProvideValue = {
    firstDayOfWeek: 1,
    today: mockDate,
    locale: 'en-US',
    weekdayFormat: 'short',
    disabledDate: vi.fn(),
    defaultTime: mockDefaultTime,
  };

  const mountComponent = (modelValue: Date | null = null) =>
    mount(AppDateMode, {
      props: {
        modelValue,
      },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: { value: mockProvideValue },
        },
      },
    });

  it('render the AppDateTimeController component', () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent(AppDateTimeController).exists()).toBe(true);
  });

  it('initialises the currentDateDisplay with modelValue, if it is specified', () => {
    const mockDate = new Date(2025, 0, 1);
    const wrapper = mountComponent(mockDate);

    const controller = wrapper.findComponent(AppDateTimeController);

    expect(controller.exists()).toBeTruthy();

    expect(controller.props('modelValue')).toEqual(mockDate);
  });

  it('initialises currentDateDisplay from the current date with defaultTime, if modelValue is not specified', () => {
    const wrapper = mountComponent();

    const expectedDate = setTime(new Date());

    const controller = wrapper.findComponent(AppDateTimeController);

    expect(controller.exists()).toBeTruthy();

    expect(controller.props('modelValue')).toEqual(expectedDate);
  });

  it('updates currentDateDisplay when modelValue changes', async () => {
    const initialDate = new Date(2025, 0, 1);
    const newDate = new Date(2025, 5, 15);

    const wrapper = mountComponent(initialDate);

    await wrapper.setProps({ modelValue: newDate });

    const controller = wrapper.findComponent(AppDateTimeController);

    expect(controller.exists()).toBeTruthy();

    expect(controller.props('modelValue')).toEqual(newDate);
  });

  it('updates modelValue when selectDate is called', async () => {
    await fakeTimeWrapper(mockDate, async () => {
      mockProvideValue.disabledDate.mockReturnValue(false);
      const wrapper = mountComponent();

      const table = wrapper.findComponent(AppDayTable);

      const tbody = table.find('tbody');
      const cells = tbody.findAll('.app-date-time-picker-day-table__cell');

      const cell = cells.find(
        el =>
          !el
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      )!;

      await cell.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toStrictEqual(
        mockDate
      );
    });
  });
});
