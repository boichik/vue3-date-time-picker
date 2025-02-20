import AppYearTable from '@/components/app-date-time-picker/src/components/table/AppYearTable.vue';
import AppMonthTable from '@/components/app-date-time-picker/src/components/table/AppMonthTable.vue';
import AppDayTable from '@/components/app-date-time-picker/src/components/table/AppDayTable.vue';
import AppDateTimeController from '@/components/app-date-time-picker/src/components/controller/AppDateTimeController.vue';
import AppDateTimePickerPanel from '@/components/app-date-time-picker/src/components/panel/AppDateTimePanel.vue';
import { AppDateTimePickerMode } from '@/components/app-date-time-picker/src/enums/dateTimePickerMode';
import { flushPromises, mount } from '@vue/test-utils';
import { subMonths, subYears } from 'date-fns';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerGlobalTableComponentDataProvide,
} from '@/components/app-date-time-picker/src/const';
import AppDateTimePanel from '@/components/app-date-time-picker/src/components/panel/AppDateTimePanel.vue';

describe('AppDateTimeController', () => {
  const mockDate = new Date(2025, 0, 1);

  const mockComponentData = {
    firstDayOfWeek: 1,
    today: mockDate,
    locale: 'en-US',
    weekdayFormat: 'short',
    disabledDate: vi.fn(),
  };

  const mockTableComponentData = {
    select: vi.fn(),
  };

  const mountComponent = (
    props = {},
    modelValue = mockDate,
    mode: AppDateTimePickerMode = AppDateTimePickerMode.Day
  ) =>
    mount(AppDateTimeController, {
      props: {
        selectedDate: mockDate,
        modelValue,
        ...props,
      },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: {
            value: { ...mockComponentData, mode },
          },
          [AppDateTimePickerGlobalTableComponentDataProvide]:
            mockTableComponentData,
        },
      },
    });

  it('render child components', () => {
    const wrapper = mountComponent();

    expect(wrapper.findComponent(AppDateTimePickerPanel).exists()).toBe(true);
    expect(wrapper.findComponent(AppDayTable).exists()).toBe(true);
    expect(wrapper.findComponent(AppMonthTable).exists()).toBe(true);
    expect(wrapper.findComponent(AppYearTable).exists()).toBe(true);
  });

  it('should display a calendar with the days of the month', async () => {
    const wrapper = mountComponent();

    expect(wrapper.findComponent(AppDayTable).isVisible()).toBe(true);
    expect(wrapper.findComponent(AppMonthTable).isVisible()).toBe(false);
    expect(wrapper.findComponent(AppYearTable).isVisible()).toBe(false);
  });

  it('should display a calendar with the months of the year', async () => {
    const wrapper = mountComponent({}, undefined, AppDateTimePickerMode.Month);

    expect(wrapper.findComponent(AppDayTable).isVisible()).toBe(false);
    expect(wrapper.findComponent(AppMonthTable).isVisible()).toBe(true);
    expect(wrapper.findComponent(AppYearTable).isVisible()).toBe(false);
  });

  it('should display a calendar with the years of the decade', async () => {
    const wrapper = mountComponent({}, undefined, AppDateTimePickerMode.Year);

    expect(wrapper.findComponent(AppDayTable).isVisible()).toBe(false);
    expect(wrapper.findComponent(AppMonthTable).isVisible()).toBe(false);
    expect(wrapper.findComponent(AppYearTable).isVisible()).toBe(true);
  });

  it('updates the current date when calling prevMonth, nextMonth, prevYear, nextYear', () => {
    const wrapper = mountComponent();

    const panel = wrapper.findComponent(AppDateTimePanel);

    panel.vm.$emit('prevMonth', 1);
    expect(wrapper.emitted('update:modelValue')![0][0]).toStrictEqual(
      subMonths(mockDate, 1)
    );
    panel.vm.$emit('nextMonth', 1);
    expect(wrapper.emitted('update:modelValue')![1][0]).toStrictEqual(mockDate);

    panel.vm.$emit('prevYear', 1);
    expect(wrapper.emitted('update:modelValue')![2][0]).toStrictEqual(
      subYears(mockDate, 1)
    );

    panel.vm.$emit('nextYear', 1);
    expect(wrapper.emitted('update:modelValue')![3][0]).toStrictEqual(mockDate);
  });

  it('changes the mode when calling handleChangeMode', async () => {
    const wrapper = mountComponent();
    const panel = wrapper.findComponent(AppDateTimePanel);

    panel.vm.$emit('changeMode', AppDateTimePickerMode.Month);

    await flushPromises();

    expect(wrapper.findComponent(AppMonthTable).isVisible()).toBe(true);

    panel.vm.$emit('changeMode', AppDateTimePickerMode.Year);

    await flushPromises();

    expect(wrapper.findComponent(AppYearTable).isVisible()).toBe(true);
  });

  it('updates the date on the update event in child components', async () => {
    const newDate = new Date(2025, 5, 15);
    const wrapper = mountComponent();

    await wrapper.findComponent(AppDayTable).vm.$emit('update', newDate);
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(newDate);
  });
});
